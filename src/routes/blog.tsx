import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { BLOG_POSTS } from "@/data/blog";
import { BookOpen, Clock, Calendar } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — PlanoCerto" },
      { name: "description", content: "Artigos e guias sobre planos de saúde para MEI." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Blog</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Guias e dicas sobre planos de saúde para MEI e autônomos
        </p>
      </header>

      <div className="space-y-4">
        {BLOG_POSTS.map(post => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="block rounded-2xl bg-card border border-border p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                {post.category}
              </span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
