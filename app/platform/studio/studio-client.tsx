"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  Send, Paperclip, Download, 
  X, Settings2, Sparkles, Bot, Layers, UploadCloud, User, Video, Clock, Wand2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { cn } from "@/lib/utils";
import { enhancePrompt } from "@/lib/prompt-enhancer";
import { CreditPaywallModal } from "@/app/components/ui/credit-paywall-modal";

// --- TYPES ---
type AiModel = {
  id: string;
  name: string;
  provider: string; // OPENAI | GEMINI | KLING
  modelType: "LLM" | "IMAGE" | "VIDEO" | "AUDIO" | "EMBEDDING" | "MULTIMODAL"; 
  apiIdentifier: string;
  creditCost: number;
};

type GeneratedImage = {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: Date;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string; 
  type: "text" | "image" | "video";
  attachments?: string[];
};

interface StudioClientProps {
  userCredits: number;
  models: AiModel[];
  initialGallery: GeneratedImage[];
  isGuest?: boolean;
}

export default function StudioClient({ userCredits, models, initialGallery, isGuest = false }: StudioClientProps) {
  // --- STATE ---
  const [mounted, setMounted] = useState(false);
  const [credits, setCredits] = useState(userCredits);
  const [gallery, setGallery] = useState<GeneratedImage[]>(initialGallery);
  
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Paywall Modal State
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallCreditsNeeded, setPaywallCreditsNeeded] = useState(1);

  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || "");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [videoDuration, setVideoDuration] = useState("5"); // For video generation

  // --- REFS ---
  // Reference point to track end of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeModel = models.find(m => m.id === selectedModelId);
  const isImageModel = activeModel?.modelType === "IMAGE";
  const isVideoModel = activeModel?.modelType === "VIDEO";

  // --- URL PARAMS ---
  const searchParams = useSearchParams();

  // --- HYDRATION FIX ---
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- LOAD PROMPT FROM URL ---
  useEffect(() => {
    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt && mounted) {
      setPrompt(decodeURIComponent(urlPrompt));
      toast.success("Prompt loaded from Chat!", {
        description: "Edit if needed and click Generate.",
        icon: <Wand2 className="w-4 h-4" />
      });
      // Clean URL without reload
      window.history.replaceState({}, '', '/platform/studio');
    }
  }, [searchParams, mounted]);

  // --- AUTO SCROLL EFFECT ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // --- HANDLERS ---

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are supported.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files);
  }, []);

  const removeAttachment = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownload = async (url: string, filename: string, isVideo: boolean = false) => {
    try {
      // Check if URL is a data URL (base64) - download directly
      if (url.startsWith('data:')) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `ai-generated-${filename}.${isVideo ? 'mp4' : 'png'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download started!");
        return;
      }

      // For external URLs, use our proxy API to bypass CORS
      const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=ai-generated-${filename}&type=${isVideo ? 'video' : 'image'}`;
      
      const link = document.createElement("a");
      link.href = proxyUrl;
      link.download = `ai-generated-${filename}.${isVideo ? 'mp4' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started!");
    } catch (e) { 
      console.error("Download error:", e);
      toast.error("Download failed. Please try right-click and 'Save As'."); 
    }
  };

  // --- MAGIC PROMPT HANDLER ---
  const handleMagicPrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setIsEnhancing(true);
    try {
      const type = isVideoModel ? "video" : "image";
      const result = await enhancePrompt(prompt, type);
      
      if (result.success && result.enhancedPrompt) {
        setPrompt(result.enhancedPrompt);
        toast.success("✨ Prompt enhanced!");
      } else {
        toast.error(result.error || "Failed to enhance prompt");
      }
    } catch (error) {
      toast.error("Failed to enhance prompt");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async () => {
    if ((!prompt.trim() && attachedImages.length === 0) || !activeModel) return;

    // Check if guest or insufficient credits - show paywall
    if (isGuest || credits < activeModel.creditCost) {
      setPaywallCreditsNeeded(activeModel.creditCost);
      setShowPaywall(true);
      return;
    }

    const currentPrompt = prompt;
    const currentAttachments = [...attachedImages];
    const currentModel = activeModel; // Capture current model state

    setPrompt("");
    setAttachedImages([]);
    
    // Optimistic UI Update
    const userMsg: ChatMessage = {
      role: "user",
      content: currentPrompt,
      type: "text",
      attachments: currentAttachments
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt,
          modelId: currentModel.id,
          aspectRatio: currentModel.modelType === "IMAGE" ? aspectRatio : undefined,
          images: currentAttachments,
          duration: currentModel.modelType === "VIDEO" ? videoDuration : undefined
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      const aiMsg: ChatMessage = {
        role: "assistant",
        content: data.result,
        type: currentModel.modelType === "IMAGE" ? "image" : 
              currentModel.modelType === "VIDEO" ? "video" : "text"
      };

      setMessages(prev => [...prev, aiMsg]);
      setCredits(prev => Math.max(0, prev - currentModel.creditCost));

      if (currentModel.modelType === "IMAGE") {
        setGallery(prev => [{
            id: Date.now().toString(),
            imageUrl: data.result,
            prompt: currentPrompt,
            createdAt: new Date()
        }, ...prev]);
      }

    } catch (error: any) {
      toast.error(error.message);
      // Add error message instead of removing the last message
      setMessages(prev => [...prev, { role: "assistant", content: "Error: " + error.message, type: "text" }]);
    } finally {
      setIsLoading(false);
      // Focus on input
      setTimeout(() => {
          const textarea = document.querySelector('textarea');
          if(textarea) textarea.focus();
      }, 100);
    }
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] w-full items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading Studio...</div>
      </div>
    );
  }

  return (
    // MAIN LAYOUT CONTAINER: Fixed Height Calculation
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-visible relative">
      
      {/* DRAG OVERLAY */}
      {isDragging && (
        <div 
            className="absolute inset-0 z-50 backdrop-blur-sm border-2 border-dashed border-primary/50 m-3 rounded-lg flex flex-col items-center justify-center animate-fade-in"
            style={{ background: 'hsl(var(--primary) / 0.1)' }}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Drop images here</h3>
            <p className="text-xs text-muted-foreground mt-1">Add images to your prompt</p>
        </div>
      )}

      {/* --- LEFT COLUMN: CHAT INTERFACE --- */}
      <div 
        className="flex-1 flex flex-col min-w-0"
        onDragOver={onDragOver}
      >
        
        {/* 1. HEADER (Fixed) */}
        <header className="h-auto min-h-[56px] flex-none bg-card border-b border-border flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 gap-2 z-30 relative">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-visible flex-wrap">
                {/* Model Selector */}
                <div className="flex items-center gap-1 sm:gap-1.5 bg-muted rounded-md p-1 sm:p-1.5">
                    <div className="px-1 sm:px-1.5">
                        {activeModel?.provider === "OPENAI" ? <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success"/> : 
                         activeModel?.provider === "KLING" ? <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive"/> :
                         <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info"/>}
                    </div>
                    <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                        <SelectTrigger className="w-[120px] sm:w-[160px] border-none bg-transparent h-7 sm:h-8 focus:ring-0 text-[11px] sm:text-xs font-medium">
                            <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                            {models.map(m => (
                                <SelectItem key={m.id} value={m.id}>
                                    <span className="flex items-center gap-2">
                                        {m.name} 
                                        <span className="text-2xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                            {m.creditCost}c
                                        </span>
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isImageModel && (
                     <div className="flex items-center gap-1 sm:gap-1.5 bg-muted rounded-md p-1 sm:p-1.5">
                        <div className="px-1 sm:px-1.5"><Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground"/></div>
                        <Select value={aspectRatio} onValueChange={setAspectRatio}>
                            <SelectTrigger className="w-[70px] sm:w-[90px] border-none bg-transparent h-7 sm:h-8 focus:ring-0 text-[11px] sm:text-xs font-medium">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1:1">Square</SelectItem>
                                <SelectItem value="16:9">Landscape</SelectItem>
                                <SelectItem value="9:16">Portrait</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                )}

                {isVideoModel && (
                     <div className="flex items-center gap-1 sm:gap-1.5 bg-muted rounded-md p-1 sm:p-1.5">
                        <div className="px-1 sm:px-1.5"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive"/></div>
                        <Select value={videoDuration} onValueChange={setVideoDuration}>
                            <SelectTrigger className="w-[70px] sm:w-[90px] border-none bg-transparent h-7 sm:h-8 focus:ring-0 text-[11px] sm:text-xs font-medium">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 sec</SelectItem>
                                <SelectItem value="10">10 sec</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                )}
            </div>

            {/* Credit Badge */}
            <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium bg-warning/10 text-warning rounded-md px-2 sm:px-3 py-1.5 sm:py-2">
                <span>⚡</span>
                {credits}
            </div>
        </header>

        {/* 2. CHAT HISTORY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth custom-scrollbar">
            <div className="max-w-2xl mx-auto flex flex-col gap-4 min-h-full justify-end">
                
                {/* Welcome / Empty State */}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 my-auto">
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-foreground">Ready to Create?</h3>
                            <p className="text-xs text-muted-foreground max-w-sm">
                                Select a model above. Type a prompt or drag & drop images to start generating.
                            </p>
                        </div>
                        <div className="badge-default text-2xs mt-2">
                            💡 Try: &quot;A cyberpunk city at sunset&quot;
                        </div>
                    </div>
                )}

                {/* Message List */}
                {messages.map((msg, i) => (
                    <div key={i} className={cn(
                        "flex w-full gap-3 animate-fade-in",
                        msg.role === "user" ? "justify-end" : "justify-start"
                    )}>
                        {/* Avatar for Assistant */}
                        {msg.role === "assistant" && (
                            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-none mt-1">
                                <Bot className="w-4 h-4 text-primary-foreground" />
                            </div>
                        )}

                        <div className={cn(
                            "flex flex-col gap-2 max-w-[80%]",
                            msg.role === "user" ? "items-end" : "items-start"
                        )}>
                            
                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {msg.attachments.map((img, idx) => (
                                        <img key={idx} src={img} className="w-16 h-16 object-cover rounded-md border border-border" />
                                    ))}
                                </div>
                            )}

                            {/* Text / Image / Video Bubble */}
                            <div className={cn(
                                "rounded-lg p-3",
                                msg.role === "user" 
                                    ? "bg-primary" 
                                    : "bg-muted text-foreground border border-border"
                            )}>
                                {msg.type === "image" ? (
                                    <div className="relative group">
                                        <img 
                                            src={msg.content} 
                                            alt="Generated" 
                                            className="rounded-md w-full h-auto max-h-[400px] object-contain bg-muted" 
                                            onLoad={scrollToBottom} 
                                        />
                                        <Button 
                                            onClick={() => handleDownload(msg.content, "image")}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            size="icon-sm"
                                            variant="secondary"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ) : msg.type === "video" ? (
                                    <div className="relative group">
                                        <video 
                                            src={msg.content} 
                                            controls
                                            autoPlay
                                            loop
                                            muted
                                            className="rounded-md w-full h-auto max-h-[400px] object-contain bg-muted" 
                                            onLoadedData={scrollToBottom} 
                                        />
                                        <Button 
                                            onClick={() => handleDownload(msg.content, "video", true)}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            size="icon-sm"
                                            variant="secondary"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                        </Button>
                                        <div className="absolute bottom-2 left-2 badge-destructive flex items-center gap-1">
                                            <Video className="w-3 h-3" /> AI Video
                                        </div>
                                    </div>
                                ) : (
                                    <p className={cn(
                                        "whitespace-pre-wrap leading-relaxed text-sm",
                                        msg.role === "user" ? "text-white" : ""
                                    )}>
                                        {msg.content}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Avatar for User */}
                        {msg.role === "user" && (
                            <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-none mt-1 border border-border">
                                <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                ))}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-start gap-3 animate-fade-in">
                        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-none">
                            <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="bg-muted border border-border p-3 rounded-lg flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">Generating...</span>
                        </div>
                    </div>
                )}
                
                {/* Dummy Div to Scroll to */}
                <div ref={messagesEndRef} className="h-1" />
            </div>
        </div>

        {/* 3. INPUT AREA (Fixed) */}
        <div className="flex-none p-4 border-t border-border z-20">
             <div className="max-w-2xl mx-auto relative bg-card border border-border rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                
                {/* Attachment Previews */}
                {attachedImages.length > 0 && (
                    <div className="p-2 flex gap-2 overflow-x-auto border-b border-border custom-scrollbar">
                        {attachedImages.map((img, idx) => (
                            <div key={idx} className="relative w-12 h-12 group flex-none">
                                <img src={img} className="w-full h-full object-cover rounded-md border border-border" />
                                <button 
                                    onClick={() => removeAttachment(idx)}
                                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-end gap-2 p-2">
                    <input 
                        type="file" multiple accept="image/*" className="hidden" 
                        ref={fileInputRef} onChange={handleFileUpload}
                    />
                    <Button 
                        variant="ghost" size="icon-sm" 
                        className="text-muted-foreground"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="w-4 h-4" />
                    </Button>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={isVideoModel ? "Describe the video motion..." : isImageModel ? "Describe the image you want to create..." : "Type a message..."}
                        className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 resize-none max-h-24 min-h-[36px] py-2 text-sm text-foreground scrollbar-hide placeholder:text-muted-foreground"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />

                    {/* Magic Prompt Button */}
                    {(isImageModel || isVideoModel) && (
                      <Button 
                        variant="ghost" 
                        size="icon-sm"
                        disabled={isEnhancing || !prompt.trim()}
                        onClick={handleMagicPrompt}
                        className="text-violet-500 hover:text-violet-400 hover:bg-violet-500/10 relative group"
                        title="Enhance prompt with AI"
                      >
                        {isEnhancing ? (
                          <div className="animate-spin w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full" />
                        ) : (
                          <Wand2 className="w-4 h-4" />
                        )}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Magic Prompt ✨
                        </span>
                      </Button>
                    )}

                    <Button 
                        disabled={isLoading || (!prompt.trim() && attachedImages.length === 0)} 
                        onClick={handleSubmit}
                        size="icon-sm"
                    >
                        {isLoading ? (
                            <div className="animate-spin w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" /> 
                        ) : (
                            <Send className="w-3.5 h-3.5" />
                        )}
                    </Button>
                </div>
             </div>
             <p className="text-center text-2xs text-muted-foreground mt-2">
                 Enter to send · Shift+Enter for new line
             </p>
        </div>

      </div>

      {/* --- RIGHT: GALLERY SIDEBAR --- */}
      <div className="hidden lg:flex w-64 bg-card border-l border-border flex-col h-full flex-none z-20">
            <div className="p-3 border-b border-border flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-xs font-medium text-foreground">Recent Creations</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                <div className="grid grid-cols-2 gap-2">
                    {gallery.map((img) => (
                        <div key={img.id} className="relative aspect-square group rounded-md overflow-hidden border border-border cursor-pointer hover:border-primary/50 transition-colors">
                            <Image 
                                src={img.imageUrl} 
                                alt="Gallery Item" 
                                fill 
                                className="object-cover transition-transform duration-300 group-hover:scale-105" 
                                sizes="100px"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                                <Button 
                                    size="icon-xs" variant="secondary"
                                    onClick={() => handleDownload(img.imageUrl, "gallery-img")}
                                >
                                    <Download className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {gallery.length === 0 && (
                        <div className="col-span-2 empty-state py-8">
                            <Sparkles className="empty-state-icon" />
                            <p className="empty-state-description">Your creations will appear here</p>
                        </div>
                    )}
                </div>
            </div>
      </div>

      {/* Credit Paywall Modal */}
      <CreditPaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        requiredCredits={paywallCreditsNeeded}
        currentCredits={credits}
        actionType={isVideoModel ? "video" : "image"}
      />
    </div>
  );
}