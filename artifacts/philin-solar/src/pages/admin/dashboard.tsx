import { useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { Newspaper, Image, Video, LogOut, LayoutDashboard, Plus, Edit3, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface NewsPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
}

interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
  category: string;
  sortOrder: number;
  createdAt: string;
}

interface GalleryVideo {
  id: number;
  src: string;
  title: string;
  description: string | null;
  category: string;
  sortOrder: number;
  createdAt: string;
}

function useNewsPosts() {
  return useQuery<NewsPost[]>({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const res = await fetch("/api/admin/news", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      return data.posts || [];
    },
  });
}

function useGalleryPhotos() {
  return useQuery<GalleryPhoto[]>({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await fetch("/api/admin/gallery", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch gallery");
      const data = await res.json();
      return data.photos || [];
    },
  });
}

function useGalleryVideos() {
  return useQuery<GalleryVideo[]>({
    queryKey: ["admin-gallery-videos"],
    queryFn: async () => {
      const res = await fetch("/api/admin/gallery/videos", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch gallery videos");
      const data = await res.json();
      return data.videos || [];
    },
  });
}

export default function AdminDashboard() {
  const { logout, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"news" | "gallery">("news");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Philin Solar Solutions</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab("news")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "news" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-muted"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            News
          </button>
          <button
            onClick={() => setTab("gallery")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "gallery" ? "bg-primary text-white" : "bg-white text-foreground hover:bg-muted"
            }`}
          >
            <Image className="w-4 h-4" />
            Gallery
          </button>
        </div>

        {tab === "news" ? <NewsManager /> : <GalleryManager />}
      </div>
    </div>
  );
}

function NewsManager() {
  const { data: posts, isLoading } = useNewsPosts();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-news"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">News Posts</h2>
        <Button onClick={() => navigate("/admin/news/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>
      <div className="grid gap-4">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt || post.content.slice(0, 80)}...</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${post.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/news/edit/${post.id}`)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { if (confirm("Delete this post?")) deleteMutation.mutate(post.id); }}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No news posts yet.</p>
        )}
      </div>
    </div>
  );
}

function GalleryManager() {
  const { data: photos, isLoading } = useGalleryPhotos();
  const { data: videos, isLoading: videosLoading } = useGalleryVideos();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-gallery"] }),
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/gallery/videos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete video");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-gallery-videos"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gallery Media</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/gallery/video-upload")}>
            <Video className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
          <Button onClick={() => navigate("/admin/gallery/upload")}>
            <Plus className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Photos</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? (
          <p className="text-muted-foreground col-span-full">Loading...</p>
        ) : photos && photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src={photo.src} alt={photo.alt} className="w-full h-32 object-cover" />
              <div className="p-2">
                <p className="text-xs font-medium truncate">{photo.alt}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{photo.category}</p>
              </div>
              <button
                onClick={() => { if (confirm("Delete this photo?")) deleteMutation.mutate(photo.id); }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full">No photos yet.</p>
        )}
      </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Videos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videosLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : videos && videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <video src={video.src} controls preload="metadata" className="w-full aspect-video object-cover bg-black" />
                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <Play className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{video.title}</p>
                      <p className="text-xs text-muted-foreground uppercase">{video.category}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { if (confirm("Delete this video?")) deleteVideoMutation.mutate(video.id); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label={`Delete ${video.title}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No videos yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
