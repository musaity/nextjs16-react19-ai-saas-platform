"use client";

import { useState, useMemo } from "react";
import { deleteImage } from "@/lib/actions"; // Server action
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { 
  Download, 
  Trash2, 
  Copy, 
  Maximize2, 
  X, 
  Calendar, 
  Sparkles, 
  Box, 
  Search,
  Filter,
  Image as ImageIcon,
  Video,
  MessageSquare,
  Clock,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image"; 
import { cn } from "@/lib/utils";

// Filter Types
type ContentType = "all" | "image" | "video" | "chat";
type DateRange = "all" | "24h" | "7d" | "30d";

interface GalleryClientProps {
  initialImages: any[];
}

export default function GalleryClient({ initialImages }: GalleryClientProps) {
  const [images, setImages] = useState(initialImages);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Advanced Filters
  const [contentType, setContentType] = useState<ContentType>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter logic
  const filteredImages = useMemo(() => {
    let result = [...images];

    // Search filter
    if (searchQuery) {
      result = result.filter((img) =>
        img.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Content type filter
    if (contentType !== "all") {
      result = result.filter((img) => {
        const url = img.imageUrl?.toLowerCase() || "";
        if (contentType === "video") {
          return url.includes(".mp4") || url.includes("video") || img.status === "video";
        }
        return true; // Images by default
      });
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let cutoffDate: Date;

      switch (dateRange) {
        case "24h":
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }

      result = result.filter((img) => new Date(img.createdAt) >= cutoffDate);
    }

    return result;
  }, [images, searchQuery, contentType, dateRange]);

  // Active filter count
  const activeFilterCount = (contentType !== "all" ? 1 : 0) + (dateRange !== "all" ? 1 : 0);

  const clearFilters = () => {
    setContentType("all");
    setDateRange("all");
    setSearchQuery("");
  };

  // --- ACTIONS ---

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteImage(id);
      if (res.success) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        setSelectedImage(null);
        toast.success("Image deleted successfully");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `ai-creation-${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download started");
    } catch (e) {
        toast.error("Download failed");
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Prompt copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search your prompts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full surface border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "gap-2 relative",
            activeFilterCount > 0 && "border-violet-500/50 bg-violet-500/5"
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-violet-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="surface border border-border rounded-2xl p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Content Type Filter */}
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Content Type</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "all", label: "All", icon: Box },
                  { value: "image", label: "Images", icon: ImageIcon },
                  { value: "video", label: "Videos", icon: Video },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setContentType(option.value as ContentType)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      contentType === option.value
                        ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Date Range</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "all", label: "All Time" },
                  { value: "24h", label: "Last 24h" },
                  { value: "7d", label: "Last 7 Days" },
                  { value: "30d", label: "This Month" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateRange(option.value as DateRange)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      dateRange === option.value
                        ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {contentType !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-500/10 text-violet-400 text-xs rounded-full">
              {contentType === "image" ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
              {contentType === "image" ? "Images" : "Videos"}
              <button onClick={() => setContentType("all")} className="ml-1 hover:text-violet-300">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {dateRange !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-500/10 text-violet-400 text-xs rounded-full">
              <Clock className="w-3 h-3" />
              {dateRange === "24h" ? "Last 24h" : dateRange === "7d" ? "Last 7 Days" : "This Month"}
              <button onClick={() => setDateRange("all")} className="ml-1 hover:text-violet-300">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{filteredImages.length}</span> 
          {filteredImages.length === 1 ? " result" : " results"}
          {images.length !== filteredImages.length && (
            <span className="text-muted-foreground"> out of {images.length}</span>
          )}
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredImages.map((image) => (
          <div 
            key={image.id} 
            onClick={() => setSelectedImage(image)}
            className="group relative aspect-square surface rounded-2xl overflow-hidden cursor-pointer border border-border hover:border-violet-500/50 transition-all duration-300 hover:shadow-glow"
          >
            <Image 
              src={image.imageUrl} 
              alt={image.prompt} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
               <p className="text-primary-foreground text-sm font-medium line-clamp-2 mb-3">{image.prompt}</p>
               <div className="flex items-center gap-2">
                 <span className="text-[11px] bg-background/30 backdrop-blur-md px-3 py-1.5 rounded-lg text-primary-foreground flex items-center gap-1.5 font-medium">
                    <Maximize2 className="w-3 h-3" /> View Details
                 </span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="w-16 h-16 surface rounded-2xl flex items-center justify-center mb-4 border border-border">
                {activeFilterCount > 0 ? (
                  <Filter className="w-8 h-8 opacity-50" />
                ) : (
                  <Search className="w-8 h-8 opacity-50" />
                )}
            </div>
            <p className="text-foreground/60 font-medium mb-1">
              {activeFilterCount > 0 ? "No matching results" : "No images found"}
            </p>
            <p className="text-sm mb-4">
              {activeFilterCount > 0 
                ? "Try adjusting your filters" 
                : searchQuery 
                  ? "Try a different search term" 
                  : "Start creating to fill your gallery!"
              }
            </p>
            {activeFilterCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-[95vw] !bg-card !backdrop-blur-xl border-border p-0 overflow-hidden text-foreground sm:rounded-2xl max-h-[90vh] md:max-h-[85vh] flex flex-col md:flex-row">
            <VisuallyHidden.Root>
              <DialogTitle>Image Details</DialogTitle>
            </VisuallyHidden.Root>
            
            {/* Left: Image (Large) */}
            <div className="flex-shrink-0 md:flex-1 bg-muted/50 relative flex items-center justify-center h-[35vh] md:h-auto md:min-h-[400px] p-4 md:p-6">
                {selectedImage && (
                    <img 
                      src={selectedImage.imageUrl} 
                      alt="Full View" 
                      className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl" 
                    />
                )}
            </div>

            {/* Right: Details & Actions */}
            <div className="w-full md:w-[340px] flex flex-col border-t md:border-t-0 md:border-l border-border bg-card flex-1 md:flex-initial overflow-hidden">
                
                {/* Header */}
                <div className="p-4 md:p-5 border-b border-border flex justify-between items-start flex-shrink-0">
                    <h3 className="font-semibold text-lg flex items-center gap-2.5 text-foreground">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20">
                          <Sparkles className="w-4 h-4 text-violet-400" />
                        </div>
                        Image Details
                    </h3>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedImage(null)} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 p-4 md:p-5 overflow-auto">
                    <div className="space-y-4">
                        
                        {/* Prompt */}
                        <div className="space-y-2.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Prompt</label>
                            <div className="bg-muted p-4 rounded-xl border border-border text-sm leading-relaxed text-foreground">
                                {selectedImage?.prompt}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted border border-border">
                                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                  <Box className="w-4 h-4 text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">Model</p>
                                    <p className="text-sm font-medium text-foreground">{selectedImage?.aiModel?.name || "Unknown Model"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted border border-border">
                                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                  <Calendar className="w-4 h-4 text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">Created At</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {selectedImage && new Date(selectedImage.createdAt).toLocaleDateString("en-US", {
                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollArea>

                {/* Footer Actions */}
                <div className="p-4 md:p-5 border-t border-border bg-muted/50 space-y-2 flex-shrink-0">
                    <Button 
                      onClick={() => selectedImage && handleDownload(selectedImage.imageUrl, selectedImage.id)} 
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-primary-foreground font-semibold shadow-glow"
                    >
                        <Download className="w-4 h-4 mr-2" /> Download Image
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={() => selectedImage && handleCopyPrompt(selectedImage.prompt)} variant="outline" className="text-muted-foreground hover:text-foreground">
                           <Copy className="w-4 h-4 mr-2" /> Copy Prompt
                        </Button>
                        <Button 
                           onClick={() => selectedImage && handleDelete(selectedImage.id)} 
                           disabled={isDeleting}
                           className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                        >
                           {isDeleting ? "..." : <><Trash2 className="w-4 h-4 mr-2" /> Delete</>}
                        </Button>
                    </div>
                </div>

            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}