import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/config";
import { 
  Video, 
  ArrowLeft, 
  Home,
  ChevronRight,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();
  const baseUrl = getAppUrl();
  const siteName = settings?.siteName || "AI Creative Studio";
  
  return {
    title: "Video Generation API",
    description: `Generate AI videos programmatically with ${siteName} API. Create stunning videos from images using Kling AI.`,
    openGraph: {
      title: `Video Generation API | ${siteName}`,
      description: "Generate AI videos programmatically.",
      url: `${baseUrl}/docs/api/videos`,
    },
  };
}

export default function VideoApiPage() {
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
            <span className="font-medium text-foreground">Videos</span>
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
          <div className="p-2 rounded-lg bg-pink-500/10">
            <Video className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Video Generation API</h1>
            <p className="text-muted-foreground">Generate AI videos from images or text</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <div className="font-medium text-amber-500">Asynchronous Processing</div>
              <p className="text-sm text-muted-foreground mt-1">
                Video generation is asynchronous. You'll receive a task ID and can poll for status or use webhooks.
              </p>
            </div>
          </div>
        </div>

        {/* Create Video Task */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Create Video Task</h2>
          <div className="mb-4 p-4 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-semibold">POST</span>
              <code className="text-sm font-mono text-foreground">/api/kling/image-to-video</code>
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
                  <td className="py-3 px-4 font-mono text-pink-500">imageUrl</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4"><span className="text-emerald-500">Yes</span></td>
                  <td className="py-3 px-4 text-muted-foreground">URL of the source image</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-pink-500">prompt</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Motion description for the video</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-pink-500">duration</td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Video duration in seconds: 5 or 10. Default: 5</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-pink-500">mode</td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4"><span className="text-muted-foreground">No</span></td>
                  <td className="py-3 px-4 text-muted-foreground">Generation mode: std or pro. Default: std</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-foreground mb-3">Example Request</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
            <code>{`curl -X POST https://your-domain.com/api/kling/image-to-video \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "imageUrl": "https://example.com/my-image.png",
    "prompt": "Camera slowly zooms in, birds flying in background",
    "duration": 5,
    "mode": "std"
  }'`}</code>
          </pre>

          <h3 className="text-lg font-medium text-foreground mb-3">Example Response</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "data": {
    "taskId": "task_xyz789abc",
    "status": "processing",
    "estimatedTime": 120,
    "creditsUsed": 50
  }
}`}</code>
          </pre>
        </section>

        {/* Check Task Status */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Check Task Status</h2>
          <div className="mb-4 p-4 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-semibold">GET</span>
              <code className="text-sm font-mono text-foreground">/api/kling/status?taskId=&#123;taskId&#125;</code>
            </div>
          </div>

          <h3 className="text-lg font-medium text-foreground mb-3">Example Response (Processing)</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
            <code>{`{
  "success": true,
  "data": {
    "taskId": "task_xyz789abc",
    "status": "processing",
    "progress": 45
  }
}`}</code>
          </pre>

          <h3 className="text-lg font-medium text-foreground mb-3">Example Response (Complete)</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "data": {
    "taskId": "task_xyz789abc",
    "status": "completed",
    "videoUrl": "https://storage.example.com/videos/task_xyz789abc.mp4",
    "duration": 5,
    "createdAt": "2026-02-04T12:00:00Z"
  }
}`}</code>
          </pre>
        </section>

        {/* Task Status Values */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Task Status Values</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 font-mono text-amber-500">queued</td>
                  <td className="py-3 px-4 text-muted-foreground">Task is waiting in queue</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-blue-500">processing</td>
                  <td className="py-3 px-4 text-muted-foreground">Video is being generated</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-emerald-500">completed</td>
                  <td className="py-3 px-4 text-muted-foreground">Video is ready for download</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-red-500">failed</td>
                  <td className="py-3 px-4 text-muted-foreground">Generation failed (check error message)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Credit Costs</h2>
          <div className="grid gap-4">
            {[
              { mode: "Standard (5s)", credits: 50, description: "Standard quality, 5 second video" },
              { mode: "Standard (10s)", credits: 100, description: "Standard quality, 10 second video" },
              { mode: "Pro (5s)", credits: 100, description: "High quality, 5 second video" },
              { mode: "Pro (10s)", credits: 200, description: "High quality, 10 second video" },
            ].map((item) => (
              <div key={item.mode} className="p-4 rounded-lg border border-border bg-card flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{item.mode}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
                <div className="flex items-center gap-1 text-pink-500">
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold">{item.credits}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
