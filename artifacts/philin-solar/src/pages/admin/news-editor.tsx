import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/context/auth-context";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
      setIsPublished(existingPost.isPublished);
    }
  }, [existingPost]);

  useEffect(() => {
    if (title && !slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }, [title]);

  async function handleSave() {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, slug, excerpt: excerpt || null, content, imageUrl: imageUrl || null }),
        });
        if (!res.ok) throw new Error("Failed to create");
      } else if (postId) {
        const res = await fetch(`/api/admin/news/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, slug, excerpt: excerpt || null, content, imageUrl: imageUrl || null, isPublished }),
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
            <Button size="sm" onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {preview ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
            {imageUrl && <img src={imageUrl} alt={title} className="w-full h-64 object-cover rounded-lg mb-6" />}
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
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Cover Image URL (optional)</Label>
                <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
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
