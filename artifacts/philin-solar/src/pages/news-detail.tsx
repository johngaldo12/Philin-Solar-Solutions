import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NewsPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  publishedAt: string;
}

export default function NewsDetailPage() {
  const [match, params] = useRoute("/news/:id");
  const postId = match ? Number(params.id) : null;
  const [, navigate] = useLocation();

  const { data: post, isLoading } = useQuery<NewsPost>({
    queryKey: ["news", postId],
    queryFn: async () => {
      const res = await fetch(`/api/news/${postId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.post;
    },
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 container mx-auto px-4">
        <div className="max-w-3xl mx-auto animate-pulse space-y-6 py-12">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 container mx-auto px-4 text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Button onClick={() => navigate("/news")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white/60 backdrop-blur-sm pt-20 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate("/news")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            {post.excerpt && (
              <p className="text-lg text-muted-foreground italic mb-8 border-l-4 border-primary pl-4">
                {post.excerpt}
              </p>
            )}
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="w-full h-72 md:h-96 object-cover rounded-xl mb-8" />
            )}
            <div className="prose max-w-none whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
