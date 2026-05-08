import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { BLOG_POSTS } from "@/data/blog";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";

export const Route = createFileRoute("/blog/$postId")({
  component: BlogPostPage,
});

function BlogPostPage() {
  const { postId } = Route.useParams();
  const post = BLOG_POSTS.find(p => p.id === postId);

  if (!post) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">Post não encontrado</h1>
          <Link to="/blog" className="text-primary hover:underline">
            Voltar para o blog
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url });
      } catch (err) {
        // Usuário cancelou
      }
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(post.title + " " + url)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <AppShell>
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o blog
      </Link>

      <article className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
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
          <button
            onClick={handleShare}
            className="ml-auto p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Compartilhar"
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-6">
          {post.title}
        </h1>

        <div className="prose prose-sm max-w-none text-foreground">
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) {
              return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-xl font-semibold mt-5 mb-3">{line.slice(3)}</h2>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} className="font-semibold mb-2">{line.slice(2, -2)}</p>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="ml-4 mb-1">{line.slice(2)}</li>;
            }
            if (line.trim() === '') {
              return <br key={i} />;
            }
            return <p key={i} className="mb-3 text-muted-foreground leading-relaxed">{line}</p>;
          })}
        </div>
      </article>

      <div className="mt-6 rounded-xl bg-secondary p-4 text-center">
        <p className="text-sm text-foreground mb-3">
          Gostou deste artigo? Compartilhe com outros MEIs!
        </p>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </button>
      </div>
    </AppShell>
  );
}
