import { prisma } from "@/lib/db";
import { Download, Calendar, Wand2, ArrowRight, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default async function HistoryPage() {
  // Fetch latest generations from database (newest first)
  const history = await prisma.generatedImage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      AiModel: true,
    },
    take: 50, // Last 50 generations
  });

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-8 animate-fade-in">
      
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-border pb-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20">
                <Clock className="w-6 h-6 text-violet-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Generation History
              </h1>
            </div>
            <p className="text-muted-foreground max-w-lg leading-relaxed">
              All your AI-generated creations are stored here. Browse, download, and revisit your past work.
            </p>
          </div>
          <div className="glass rounded-2xl px-5 py-3 border border-border text-sm font-medium text-muted-foreground">
            Total: <span className="text-foreground font-semibold">{history.length}</span> images
          </div>
        </div>

        {/* Gallery Grid */}
        {history.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-24 surface border border-border rounded-3xl">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center mb-6">
              <Wand2 className="w-10 h-10 text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No creations yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md text-center">
              Your gallery is empty. Head to the studio to create your first AI masterpiece.
            </p>
            <Link href="/platform/studio">
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-primary-foreground rounded-xl px-8 shadow-glow">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          // Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="group relative rounded-2xl overflow-hidden surface border border-border hover:border-violet-500/50 transition-all duration-300 hover:shadow-glow"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-black/30">
                  <img 
                    src={item.imageUrl} 
                    alt="AI Art" 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="rounded-xl bg-primary/80 backdrop-blur-md border border-primary hover:bg-primary text-primary-foreground">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </a>
                  </div>
                  
                  {/* Model Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-lg border border-border text-[10px] text-foreground font-medium">
                    {item.AiModel?.name}
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm text-foreground truncate pr-2">
                      {item.AiModel?.name || "AI Generated"}
                    </h3>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md shrink-0">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="text-[11px] text-muted-foreground line-clamp-2 font-mono bg-muted p-2.5 rounded-lg border border-border">
                    {item.prompt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}