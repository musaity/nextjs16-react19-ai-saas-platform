'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, ArrowRight, ArrowLeft, Home, ChevronRight, Loader2, 
  ExternalLink, Search, FileText
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

interface IntegrationDoc {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  updatedAt: string;
}

export default function IntegrationsDocsIndexPage() {
  const [docs, setDocs] = useState<IntegrationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('/api/docs/integrations');
        if (res.ok) {
          const data = await res.json();
          setDocs(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch docs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const filteredDocs = docs.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Integrations</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/docs">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Docs</span>
              </Button>
            </Link>
            <Link href="/platform/chat">
              <Button size="sm">
                Go to App
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Integration Guides
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Learn how to connect your AI assistant to various platforms. Step-by-step guides for every integration.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </section>

      {/* Docs Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredDocs.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                {searchQuery ? 'No Results Found' : 'No Documentation Available'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Documentation will be available soon'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <Link key={doc.id} href={`/docs/integrations/${doc.slug}`}>
                  <Card className="h-full p-6 hover:bg-muted/50 transition-all duration-300 hover:border-primary/30 group">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ backgroundColor: `${doc.color || '#8B5CF6'}20` }}
                      >
                        {doc.icon || '📄'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-3 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Read Guide
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-6 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-8">
            Can't find what you're looking for? We're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/platform/help">
              <Button variant="outline" size="lg">
                Help Center
              </Button>
            </Link>
            <Link href="/platform/chat">
              <Button size="lg">
                Ask AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
