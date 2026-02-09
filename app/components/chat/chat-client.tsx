"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  StopCircle,
  ChevronDown,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  Copy,
  Check,
  Lightbulb,
  Code2,
  FileText,
  Palette,
  Music,
  ChevronRight,
  X,
  Zap,
  RotateCcw,
  Phone,
  Headphones,
  Hash,
  ImageIcon,
  Video,
  Wand2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CreditPaywallModal } from "@/app/components/ui/credit-paywall-modal";

// Types
type AiModel = {
  id: string;
  name: string;
  provider: string;
  creditCost: number;
  imageUrl?: string | null;
};

type ChatPrompt = {
  id: string;
  title: string;
  prompt: string;
  description: string | null;
  icon: string;
  category: string;
};

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

interface ChatClientProps {
  userCredits: number;
  models: AiModel[];
  isGuest?: boolean;
}

// Icon mapping
const ICON_MAP: Record<string, any> = {
  "sparkles": Sparkles,
  "message-square": MessageSquare,
  "lightbulb": Lightbulb,
  "code": Code2,
  "file-text": FileText,
  "palette": Palette,
  "music": Music,
};

export default function ChatClient({ userCredits, models, isGuest = false }: ChatClientProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Core State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || "");
  const [credits, setCredits] = useState(userCredits);
  
  // Paywall State
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallCreditsNeeded, setPaywallCreditsNeeded] = useState(1);
  
  // Prompts State
  const [prompts, setPrompts] = useState<ChatPrompt[]>([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Copied State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeModel = models.find(m => m.id === selectedModelId);

  // Fetch prompts on mount
  useEffect(() => {
    fetchPrompts();
  }, []);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchPrompts = async () => {
    try {
      const res = await fetch("/api/prompts");
      if (res.ok) {
        const data = await res.json();
        setPrompts(data);
      }
    } catch (error) {
      console.error("Failed to fetch prompts");
    }
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!selectedModelId) {
      toast.error("Please select an AI Model first.");
      return;
    }

    // Check if guest or insufficient credits - show paywall
    if (isGuest || credits <= 0 || (activeModel && credits < activeModel.creditCost)) {
      setPaywallCreditsNeeded(activeModel?.creditCost || 1);
      setShowPaywall(true);
      return;
    }

    const userMessage: Message = { 
      id: generateId(),
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowPrompts(false);

    try {
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModelId,
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error("Insufficient credits");
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) return;

      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullContent += chunk;

        setMessages((prev) => {
          const newArr = [...prev];
          newArr[newArr.length - 1] = { 
            ...newArr[newArr.length - 1],
            content: fullContent 
          };
          return newArr;
        });
      }

      router.refresh();
      
      // Decrement credits after successful response
      if (activeModel) {
        setCredits(prev => Math.max(0, prev - activeModel.creditCost));
      }

      // Text-to-Speech if enabled
      if (voiceEnabled && fullContent) {
        speakText(fullContent);
      }

    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const selectPrompt = (prompt: ChatPrompt) => {
    setInput(prompt.prompt);
    setShowPrompts(false);
    inputRef.current?.focus();
  };

  // Voice Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started...");
    } catch (error) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await fetch("/api/voice/stt", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setInput(data.text);
        toast.success("Voice transcribed!");
      } else {
        toast.error("Failed to transcribe voice");
      }
    } catch (error) {
      toast.error("Transcription failed");
    }
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      const res = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 4000) }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      }
    } catch (error) {
      console.error("TTS failed");
    } finally {
      setIsSpeaking(false);
    }
  };

  const copyMessage = async (message: Message) => {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const clearChat = () => {
    setMessages([]);
    toast.success("Chat cleared");
  };

  const regenerateLastResponse = async () => {
    if (messages.length < 2) return;
    
    const lastUserMsgIndex = [...messages].reverse().findIndex(m => m.role === "user");
    if (lastUserMsgIndex === -1) return;
    
    const actualIndex = messages.length - 1 - lastUserMsgIndex;
    const lastUserMessage = messages[actualIndex];
    
    setMessages(messages.slice(0, actualIndex + 1));
    setInput(lastUserMessage.content);
    
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(fakeEvent);
    }, 100);
  };

  const categories = ["all", ...new Set(prompts.map(p => p.category))];
  const filteredPrompts = selectedCategory === "all" 
    ? prompts 
    : prompts.filter(p => p.category === selectedCategory);

  return (
    <div className="flex h-[calc(100vh-3rem)] relative w-full max-w-6xl mx-auto">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Header Bar - z-30 to be below main header (z-40) but above content */}
        <div className="sticky top-0 z-30 p-2 sm:p-4 pt-2">
          <div className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl glass border border-white/10 backdrop-blur-xl">
            {/* Model Selector */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
              </div>
              
              <div className="relative group min-w-0">
                {models.length > 0 ? (
                  <>
                    <select 
                      value={selectedModelId}
                      onChange={(e) => setSelectedModelId(e.target.value)}
                      className="appearance-none bg-transparent text-foreground font-medium text-[11px] sm:text-sm outline-none cursor-pointer pr-4 sm:pr-6 transition-all hover:text-violet-400 max-w-[100px] sm:max-w-none truncate"
                    >
                      {models.map(model => (
                        <option key={model.id} value={model.id} className="bg-card text-foreground">
                          {model.name} ({model.creditCost} cr)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </>
                ) : (
                  <span className="text-[11px] sm:text-sm text-amber-500 font-medium">No LLM models</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={cn(
                  "h-7 w-7 sm:h-9 sm:w-9 p-0 rounded-lg sm:rounded-xl",
                  voiceEnabled ? "text-violet-400" : "text-muted-foreground"
                )}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                disabled={messages.length === 0}
                className="h-7 w-7 sm:h-9 sm:w-9 p-0 rounded-lg sm:rounded-xl text-muted-foreground hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              
              <div className="h-4 sm:h-5 w-px bg-border mx-0.5 hidden sm:block" />
              
              <div className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-violet-500/10 border border-violet-500/20">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-violet-400" />
                <span className="text-[11px] sm:text-sm font-medium text-violet-400">{userCredits}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 pb-40 pt-4 space-y-6 no-scrollbar">
          
          {/* Welcome Screen */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-3xl opacity-20 rounded-full scale-150" />
                <div className="w-24 h-24 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl flex items-center justify-center relative shadow-2xl border border-violet-500/20">
                  <Bot className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">
                  Hi, I'm your AI Assistant
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed">
                  Powered by <span className="text-violet-400 font-semibold">{activeModel?.name || "AI"}</span>. 
                  Ask me anything or use quick prompts below.
                </p>
              </div>

              {/* Quick Prompts Button */}
              <Button
                onClick={() => setShowPrompts(true)}
                className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-400 border border-violet-500/30 hover:from-violet-600/30 hover:to-purple-600/30 rounded-xl px-6 py-6 h-auto"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Browse Quick Prompts
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap justify-center gap-2 pt-4 max-w-2xl">
                {["Explain quantum computing simply", "Write a professional email", "Debug my code", "Creative story ideas", "Summarize this text"].map((suggestion) => (
                  <button 
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2.5 glass rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-violet-500/50 border border-white/5 transition-all duration-300 hover:bg-violet-500/5"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Multi-Platform Integration Info */}
              <div className="w-full max-w-2xl mt-8 p-4 rounded-2xl glass border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-background flex items-center justify-center shadow-lg">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 border-2 border-background flex items-center justify-center shadow-lg">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-background flex items-center justify-center shadow-lg">
                      <Headphones className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 border-2 border-background flex items-center justify-center shadow-lg">
                      <Hash className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground ml-2">Multi-Platform Support</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Also available on WhatsApp, Telegram, Discord & Slack. Same AI, any platform.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex w-full gap-4 animate-fade-in group",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {/* Avatar - Assistant */}
              {msg.role === "assistant" && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg border border-violet-500/20 mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Message Bubble */}
              <div className={cn(
                "relative max-w-[85%] md:max-w-[75%]"
              )}>
                <div className={cn(
                  "p-4 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap",
                  msg.role === "user" 
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-sm shadow-lg" 
                    : "bg-card text-foreground border border-border rounded-bl-sm"
                )}>
                  {msg.content || (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  )}
                </div>

                {/* Message Actions */}
                {msg.role === "assistant" && msg.content && (
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessage(msg)}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                      {copiedId === msg.id ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakText(msg.content)}
                      disabled={isSpeaking}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Volume2 className="w-3 h-3 mr-1" />
                      Speak
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={regenerateLastResponse}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                    
                    {/* Divider */}
                    <div className="w-px h-4 bg-border mx-1" />
                    
                    {/* Create Image Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const encodedPrompt = encodeURIComponent(msg.content.slice(0, 500));
                        router.push(`/platform/studio?prompt=${encodedPrompt}`);
                        toast.success("Redirecting to Studio...");
                      }}
                      className="h-7 px-2 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Create Image
                    </Button>
                  </div>
                )}
              </div>

              {/* Avatar - User */}
              {msg.role === "user" && (
                <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center flex-shrink-0 border border-border mt-1">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-background via-background to-transparent pt-12 sm:pt-16">
          <form 
            onSubmit={handleSubmit}
            className="relative w-full flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-card border border-border shadow-2xl hover:border-violet-500/30 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500/20 transition-all duration-200"
          >
            {/* Prompts Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPrompts(!showPrompts)}
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-lg sm:rounded-xl flex-shrink-0",
                showPrompts ? "bg-violet-500/20 text-violet-400" : "text-muted-foreground"
              )}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Input */}
            <Input 
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${activeModel?.name || "AI"}...`}
              className="flex-1 !bg-transparent !border-none !shadow-none !outline-none focus:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 text-foreground placeholder:text-muted-foreground h-10 sm:h-12 text-sm sm:text-base"
              disabled={isLoading}
            />

            {/* Voice Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-lg sm:rounded-xl flex-shrink-0 transition-all hidden sm:flex",
                isRecording 
                  ? "bg-red-500/20 text-red-400 animate-pulse" 
                  : "text-muted-foreground hover:text-violet-400"
              )}
            >
              {isRecording ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              size="sm"
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-lg sm:rounded-xl transition-all flex-shrink-0",
                isLoading 
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                  : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg"
              )}
            >
              {isLoading ? <StopCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          </form>
          
          <p className="text-center text-[9px] sm:text-[10px] text-muted-foreground mt-2 sm:mt-3 font-medium uppercase tracking-widest">
            {activeModel?.name} • AI may produce inaccurate information
          </p>
        </div>
      </div>

      {/* Prompts Sidebar */}
      {showPrompts && (
        <div className="absolute inset-0 z-30 bg-background/80 backdrop-blur-sm flex items-end justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl max-h-[70vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Quick Prompts</h3>
                  <p className="text-xs text-muted-foreground">Click to use a prompt</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrompts(false)}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 p-4 overflow-x-auto no-scrollbar border-b border-border">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                    selectedCategory === cat
                      ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent"
                  )}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Prompts List */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPrompts.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <Sparkles className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground text-sm">No prompts available</p>
                  <p className="text-muted-foreground text-xs mt-1">Admin can add prompts from the dashboard</p>
                </div>
              ) : (
                filteredPrompts.map((prompt) => {
                  const IconComponent = ICON_MAP[prompt.icon] || Sparkles;
                  return (
                    <button
                      key={prompt.id}
                      onClick={() => selectPrompt(prompt)}
                      className="p-4 rounded-xl bg-muted/30 hover:bg-violet-500/10 border border-border hover:border-violet-500/30 text-left transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                          <IconComponent className="w-4 h-4 text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm">{prompt.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {prompt.description || prompt.prompt}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credit Paywall Modal */}
      <CreditPaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        requiredCredits={paywallCreditsNeeded}
        currentCredits={credits}
        actionType="chat"
      />
    </div>
  );
}
