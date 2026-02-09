import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/config";
import { 
  Image as ImageIcon, 
  ArrowLeft, 
  Home,
  ChevronRight,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();
  const baseUrl = getAppUrl();
  const siteName = settings?.siteName || "AI Creative Studio";
  
  return {
    title: "Image Generation API",
    description: `Generate AI images programmatically with ${siteName} API. Support for DALL-E 3, Stable Diffusion, and Gemini image models.`,
    openGraph: {
      title: `Image Generation API | ${siteName}`,
      description: "Generate AI images programmatically.",
      url: `${baseUrl}/docs/api/images`,
    },
  };
}

export default function ImageApiPage() {
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
            <span className="font-medium text-foreground">Images</span>
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
            <ImageIcon className="w-6 h-6 text-violet-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Image Generation API</h1>
            <p className="text-muted-foreground">Generate AI images from text prompts</p>
          </div>
        </div>

        {/* Endpoint Info */}
        <div className="mb-8 p-4 rounded-lg bg-muted border border-border">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-semibold">POST</span>
            <code className="text-sm font-mono text-foreground">/api/generate/image</code>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
          <p>
            Generate images using various AI models including DALL-E 3, Stable Diffusion, and Gemini.
            The API supports different image sizes, styles, and quality settings.
          </p>
        </div>

        {/* Request Body */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Request Body</h2>
          <div className="overflow-x-auto">
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
                  <td className="py-3 px-4 font-mono text-violet-500">prompt</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4"><span className="text-emerald-500">Yes</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Text description of the image to generate</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">model</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Model ID (dall-e-3, stable-diffusion-xl, gemini-image). Default: dall-e-3</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">size</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Image size: 1024x1024, 1792x1024, 1024x1792. Default: 1024x1024</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">quality</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Quality: standard or hd. Default: standard</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-violet-500">style</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Style: vivid or natural. Default: vivid</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Example Request */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Example Request</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`curl -X POST https://your-domain.com/api/generate/image \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "A futuristic cityscape at sunset with flying cars",
    "model": "dall-e-3",
    "size": "1792x1024",
    "quality": "hd",
    "style": "vivid"
  }'`}</code>
          </pre>
        </section>

        {/* Example Response */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Example Response</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "data": {
    "id": "gen_abc123xyz",
    "url": "https://storage.example.com/images/gen_abc123xyz.png",
    "prompt": "A futuristic cityscape at sunset with flying cars",
    "model": "dall-e-3",
    "size": "1792x1024",
    "creditsUsed": 15,
    "createdAt": "2026-02-04T12:00:00Z"
  }
}`}</code>
          </pre>
        </section>

        {/* Error Codes */}
        <section className="mb-12">
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
                  <td className="py-3 px-4 text-muted-foreground">Bad Request - Invalid parameters</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">401</td>
                  <td className="py-3 px-4 text-muted-foreground">Unauthorized - Invalid or missing API key</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">402</td>
                  <td className="py-3 px-4 text-muted-foreground">Payment Required - Insufficient credits</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">429</td>
                  <td className="py-3 px-4 text-muted-foreground">Too Many Requests - Rate limit exceeded</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">500</td>
                  <td className="py-3 px-4 text-muted-foreground">Internal Server Error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Available Models */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Available Models</h2>
          <div className="grid gap-4">
            {[
              { id: "dall-e-3", name: "DALL-E 3", credits: 15, description: "OpenAI's most advanced image model" },
              { id: "dall-e-2", name: "DALL-E 2", credits: 8, description: "Fast and cost-effective" },
              { id: "gemini-image", name: "Gemini Image", credits: 12, description: "Google's multimodal image generation" },
            ].map((model) => (
              <div key={model.id} className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono text-violet-500">{model.id}</code>
                  <span className="text-xs text-muted-foreground">{model.credits} credits</span>
                </div>
                <div className="font-medium text-foreground">{model.name}</div>
                <div className="text-sm text-muted-foreground">{model.description}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
