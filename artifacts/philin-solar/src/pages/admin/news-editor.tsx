import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/context/auth-context";
import { ArrowLeft, Save, Eye, Loader2, ImagePlus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface NewsPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  isPublished: boolean;
}

export default function NewsEditorPage() {
  const [match, params] = useRoute("/admin/news/edit/:id");
  const isNew = !match;
  const postId = match ? Number(params.id) : null;
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  // Image upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: existingPost } = useQuery<NewsPost>({
    queryKey: ["news", postId],
    queryFn: async () => {
      const res = await fetch(`/api/news/${postId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.post;
    },
    enabled: !!postId,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setExcerpt(existingPost.excerpt || "");
      setContent(existingPost.content);
      setImageUrl(existingPost.imageUrl || "");
      // Always sync preview to the saved URL (or clear it) so state never drifts
      setImagePreview(existingPost.imageUrl ?? null);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsPublished(existingPost.isPublished);
    }
  }, [existingPost]);

  useEffect(() => {
    if (title && !slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }, [title]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setImageFile(selected);
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(selected);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadImage(file: File): Promise<string> {
    // Step 1: Request presigned URL
    const urlRes = await fetch("/api/storage/uploads/request-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
    });
    if (!urlRes.ok) throw new Error("Failed to get upload URL");
    const { uploadURL, objectPath } = await urlRes.json();
    if (!uploadURL || !objectPath) throw new Error("Invalid upload URL response");

    // Step 2: Upload to GCS
    const gcsRes = await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!gcsRes.ok) throw new Error("Failed to upload image to storage");

    return `/api/storage${objectPath}`;
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    setUploadError(null);
    try {
      let finalImageUrl = imageUrl;

      // If a new file was selected but not yet uploaded, upload it now
      if (imageFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadImage(imageFile);
          setImageUrl(finalImageUrl);
          setImageFile(null);
        } catch (e) {
          setUploadError("Image upload failed. Please try again.");
          setSaving(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      if (isNew) {
        const res = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, slug, excerpt: excerpt || null, content, imageUrl: finalImageUrl || null }),
        });
        if (!res.ok) throw new Error("Failed to create");
      } else if (postId) {
        const res = await fetch(`/api/admin/news/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, slug, excerpt: excerpt || null, content, imageUrl: finalImageUrl || null, isPublished }),
        });
        if (!res.ok) throw new Error("Failed to update");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      navigate("/admin");
    } catch (e) {
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  const isBusy = saving || uploadingImage;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="font-bold text-lg">{isNew ? "New Post" : "Edit Post"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPreview(!preview)}>
              <Eye className="w-4 h-4 mr-2" />
              {preview ? "Edit" : "Preview"}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isBusy || !title.trim() || !content.trim()}>
              {isBusy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {uploadingImage ? "Uploading image..." : saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {preview ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
            {(imagePreview || imageUrl) && (
              <img src={imagePreview || imageUrl} alt={title} className="w-full h-64 object-cover rounded-lg mb-6" />
            )}
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            {excerpt && <p className="text-lg text-muted-foreground mb-6 italic">{excerpt}</p>}
            <div className="prose max-w-none whitespace-pre-wrap">{content}</div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-slug" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (optional)</Label>
                <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary" rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post content here..." rows={12} />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <Label>Cover Image (optional)</Label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-muted">
                    <img src={imagePreview} alt="Cover preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {imageFile && (
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        Ready to upload on save
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">Click to select a cover image</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {uploadError && (
                  <p className="text-sm text-red-500">{uploadError}</p>
                )}
              </div>

              {!isNew && (
                <div className="flex items-center gap-3">
                  <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
                  <Label htmlFor="published">Published</Label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
