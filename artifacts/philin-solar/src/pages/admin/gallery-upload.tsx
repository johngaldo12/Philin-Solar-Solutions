import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { ArrowLeft, Upload, Loader2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function GalleryUploadPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState("ceremonial");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
      if (!alt) setAlt(selected.name.replace(/\.[^.]+$/, ""));
    }
  }

  async function handleUpload() {
    if (!file || !alt.trim()) return;
    setUploading(true);
    try {
      // Request presigned URL
      const res = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });
      const { uploadURL, objectPath } = await res.json();

      // Upload directly to GCS
      await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // Save photo record
      const servingUrl = `/api/storage${objectPath}`;
      const saveRes = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ src: servingUrl, alt, category, sortOrder: 0 }),
      });
      if (!saveRes.ok) throw new Error("Failed to save photo");

      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      navigate("/admin");
    } catch (e) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="font-bold text-lg">Upload Gallery Photo</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors min-h-[200px]"
          >
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <ImagePlus className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-medium">Click to select an image</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP up to 5MB</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alt">Description / Alt Text</Label>
            <Input id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Team ceremony 2025" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            >
              <option value="ceremonial">Ceremonial</option>
              <option value="installation">Installation</option>
              <option value="team">Team</option>
              <option value="products">Products</option>
              <option value="events">Events</option>
            </select>
          </div>

          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={uploading || !file || !alt.trim()}
          >
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {uploading ? "Uploading..." : "Upload to Gallery"}
          </Button>
        </div>
      </div>
    </div>
  );
}
