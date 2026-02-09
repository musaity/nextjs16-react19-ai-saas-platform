import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/config";
import { 
  MessageSquare, 
  ArrowLeft, 
  Home,
  ChevronRight,
  Sparkles,
  Repeat
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();
  const baseUrl = getAppUrl();
  const siteName = settings?.siteName || "AI Creative Studio";
  
  return {
    title: "Chat Completion API",
    description: `Send chat messages to AI models with ${siteName} API. Support for GPT-4o, Claude, Gemini and more.`,
    openGraph: {
      title: `Chat Completion API | ${siteName}`,
      description: "Send chat messages to AI models programmatically.",
      url: `${baseUrl}/docs/api/chat`,
    },
  };
}

export default function ChatApiPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/docs/api" className="text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">Chat</span>
          </div>
          <Link href="/docs/api">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <MessageSquare className="w-6 h-6 text-violet-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chat Completion API</h1>
            <p className="text-muted-foreground">Send messages to AI models and receive responses</p>
          </div>
        </div>

        {/* Create Chat Completion */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Create Chat Completion</h2>
          <div className="mb-4 p-4 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-semibold">POST</span>
              <code className="text-sm font-mono text-foreground">/api/chat</code>
            </div>
          </div>

          <h3 className="text-lg font-medium text-foreground mb-3">Request Body</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Parameter</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Required</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">messages</td>
                  <td className="py-3 px-4 text-muted-foreground">array</td>
                  <td className="py-3 px-4"><span className="text-emerald-500">Yes</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Array of message objects with role and content</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">model</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Model ID to use. Default: gpt-4o-mini</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">stream</td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Enable streaming response. Default: false</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">systemPrompt</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Custom system prompt to prepend</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">temperature</td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Creativity level 0-2. Default: 0.7</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">maxTokens</td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Maximum tokens in response. Default: 4096</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-foreground mb-3">Message Object</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Field</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">role</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">"user", "assistant", or "system"</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">content</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">The message content</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-foreground mb-3">Example Request</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
            <code>{`curl -X POST https://your-domain.com/api/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      { "role": "user", "content": "Explain quantum computing in simple terms" }
    ],
    "model": "gpt-4o",
    "temperature": 0.7
  }'`}</code>
          </pre>

          <h3 className="text-lg font-medium text-foreground mb-3">Example Response</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "data": {
    "id": "chat_abc123",
    "model": "gpt-4o",
    "message": {
      "role": "assistant",
      "content": "Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously..."
    },
    "usage": {
      "promptTokens": 12,
      "completionTokens": 156,
      "totalTokens": 168
    },
    "creditsUsed": 2
  }
}`}</code>
          </pre>
        </section>

        {/* Streaming */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Repeat className="w-5 h-5 text-violet-500" />
            <h2 className="text-xl font-semibold text-foreground">Streaming Response</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Enable streaming to receive tokens as they are generated. Useful for real-time chat interfaces.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">Example Streaming Request</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
            <code>{`curl -X POST https://your-domain.com/api/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      { "role": "user", "content": "Write a haiku about coding" }
    ],
    "stream": true
  }'`}</code>
          </pre>

          <h3 className="text-lg font-medium text-foreground mb-3">Streaming Response Format</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`data: {"delta": "Lines", "done": false}
data: {"delta": " of", "done": false}
data: {"delta": " code", "done": false}
data: {"delta": " flow", "done": false}
...
data: {"delta": "", "done": true, "usage": {"totalTokens": 45}}`}</code>
          </pre>
        </section>

        {/* Available Models */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <h2 className="text-xl font-semibold text-foreground">Available Models</h2>
          </div>
          <div className="grid gap-3">
            {[
              { id: "gpt-4o", provider: "OpenAI", description: "Most capable GPT-4 model with vision support" },
              { id: "gpt-4o-mini", provider: "OpenAI", description: "Fast and affordable GPT-4 variant" },
              { id: "claude-3-5-sonnet", provider: "Anthropic", description: "Excellent for complex tasks and coding" },
              { id: "claude-3-haiku", provider: "Anthropic", description: "Fast responses for simple tasks" },
              { id: "gemini-2.0-flash", provider: "Google", description: "Advanced multimodal reasoning" },
              { id: "deepseek-chat", provider: "DeepSeek", description: "Cost-effective alternative" },
            ].map((model) => (
              <div key={model.id} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-1">
                  <code className="font-mono text-sm text-violet-500">{model.id}</code>
                  <span className="text-xs text-muted-foreground">{model.provider}</span>
                </div>
                <p className="text-sm text-muted-foreground">{model.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Error Codes */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Error Codes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">400</td>
                  <td className="py-3 px-4 text-muted-foreground">Invalid request body or missing required fields</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">401</td>
                  <td className="py-3 px-4 text-muted-foreground">Invalid or missing API key</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">402</td>
                  <td className="py-3 px-4 text-muted-foreground">Insufficient credits</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">404</td>
                  <td className="py-3 px-4 text-muted-foreground">Model not found or unavailable</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">429</td>
                  <td className="py-3 px-4 text-muted-foreground">Rate limit exceeded</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">500</td>
                  <td className="py-3 px-4 text-muted-foreground">Internal server error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
