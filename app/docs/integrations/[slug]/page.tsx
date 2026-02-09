'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, ArrowLeft, ExternalLink, Clock, Loader2,
  ChevronRight, Home, FileText
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface IntegrationDoc {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  content: string;
  updatedAt: string;
}

export default function IntegrationDocPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [doc, setDoc] = useState<IntegrationDoc | null>(null);
  const [allDocs, setAllDocs] = useState<IntegrationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all docs for sidebar
        const allRes = await fetch('/api/docs/integrations');
        if (allRes.ok) {
          const allData = await allRes.json();
          setAllDocs(allData.data || []);
        }

        // Fetch specific doc
        const res = await fetch(`/api/docs/integrations?slug=${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Document not found');
          } else {
            throw new Error('Failed to fetch');
          }
          return;
        }
        
        const data = await res.json();
        setDoc(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-12 text-center max-w-md">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Document Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The documentation you're looking for doesn't exist or hasn't been published yet.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Link href="/docs/integrations">
              <Button>
                <BookOpen className="w-4 h-4 mr-2" />
                All Docs
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/docs/integrations" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Integrations
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium text-sm">{doc.title}</span>
          </div>
          <Link href={`/platform/chat?integration=${slug}`}>
            <Button size="sm">
              Go to App
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-border min-h-[calc(100vh-73px)] p-6">
          <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">Integrations</h3>
          <nav className="space-y-1">
            {allDocs.map((d) => (
              <Link
                key={d.id}
                href={`/docs/integrations/${d.slug}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  d.slug === slug
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span className="text-lg">{d.icon || '📄'}</span>
                <span className="truncate">{d.title}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-6 lg:p-12">
          {/* Doc Header */}
          <div className="mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${doc.color || '#8B5CF6'}20` }}
              >
                {doc.icon || '📄'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{doc.title}</h1>
                {doc.description && (
                  <p className="text-muted-foreground mt-1">{doc.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Updated {new Date(doc.updatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {/* Markdown Content */}
          <article className="prose prose-invert prose-violet max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 pb-2 border-b border-border">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4 ml-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-muted-foreground">{children}</li>
                ),
                code: ({ className, children }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return (
                      <pre className="bg-muted rounded-lg p-4 overflow-x-auto mb-4">
                        <code className="text-sm text-foreground font-mono">{children}</code>
                      </pre>
                    );
                  }
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-primary font-mono">{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <div className="not-prose mb-4">{children}</div>
                ),
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border border-border rounded-lg">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-muted px-4 py-2 text-left text-foreground font-semibold border-b border-border">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 text-muted-foreground border-b border-border">{children}</td>
                ),
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}
