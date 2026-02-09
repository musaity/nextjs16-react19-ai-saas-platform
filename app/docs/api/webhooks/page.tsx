import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/config";
import { 
  Webhook, 
  ArrowLeft, 
  Home,
  ChevronRight,
  Shield,
  Bell,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();
  const baseUrl = getAppUrl();
  const siteName = settings?.siteName || "AI Creative Studio";
  
  return {
    title: "Webhooks API",
    description: `Receive real-time notifications with ${siteName} webhooks. Get notified when tasks complete, credits change, and more.`,
    openGraph: {
      title: `Webhooks API | ${siteName}`,
      description: "Receive real-time event notifications via webhooks.",
      url: `${baseUrl}/docs/api/webhooks`,
    },
  };
}

export default function WebhooksApiPage() {
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
            <span className="font-medium text-foreground">Webhooks</span>
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
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Webhook className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Webhooks API</h1>
            <p className="text-muted-foreground">Receive real-time event notifications</p>
          </div>
        </div>

        {/* Setup Instructions */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Setting Up Webhooks</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Webhooks allow you to receive real-time notifications when events occur in your account.
              Configure your webhook endpoint in the dashboard settings.
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>Go to Settings → Integrations in your dashboard</li>
              <li>Enter your webhook URL (must be HTTPS)</li>
              <li>Select the events you want to receive</li>
              <li>Copy the signing secret to verify payloads</li>
            </ol>
          </div>
        </section>

        {/* Event Types */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-foreground">Event Types</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Event</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 font-mono text-orange-500">image.completed</td>
                  <td className="py-3 px-4 text-muted-foreground">Image generation completed successfully</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-orange-500">image.failed</td>
                  <td className="py-3 px-4 text-muted-foreground">Image generation failed</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-orange-500">video.completed</td>
                  <td className="py-3 px-4 text-muted-foreground">Video generation completed successfully</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-orange-500">video.failed</td>
                  <td className="py-3 px-4 text-muted-foreground">Video generation failed</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-orange-500">credits.updated</td>
                  <td className="py-3 px-4 text-muted-foreground">User credits changed (purchase, usage, refund)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-orange-500">subscription.created</td>
                  <td className="py-3 px-4 text-muted-foreground">New subscription created</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-orange-500">subscription.updated</td>
                  <td className="py-3 px-4 text-muted-foreground">Subscription plan changed</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-orange-500">subscription.cancelled</td>
                  <td className="py-3 px-4 text-muted-foreground">Subscription was cancelled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Webhook Payload */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Webhook Payload</h2>
          <p className="text-muted-foreground mb-4">
            All webhook payloads follow a consistent structure:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
            <code>{`{
  "id": "evt_abc123xyz",
  "type": "video.completed",
  "createdAt": "2026-02-04T12:00:00Z",
  "data": {
    "taskId": "task_xyz789abc",
    "userId": "user_123",
    "videoUrl": "https://storage.example.com/videos/task_xyz789abc.mp4",
    "duration": 5,
    "creditsUsed": 50
  }
}`}</code>
          </pre>

          <h3 className="text-lg font-medium text-foreground mb-3">Image Completed Event</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-6">
            <code>{`{
  "id": "evt_img456",
  "type": "image.completed",
  "createdAt": "2026-02-04T12:00:00Z",
  "data": {
    "taskId": "img_abc123",
    "userId": "user_123",
    "imageUrl": "https://storage.example.com/images/img_abc123.png",
    "model": "flux-pro",
    "creditsUsed": 10
  }
}`}</code>
          </pre>

          <h3 className="text-lg font-medium text-foreground mb-3">Credits Updated Event</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`{
  "id": "evt_cred789",
  "type": "credits.updated",
  "createdAt": "2026-02-04T12:00:00Z",
  "data": {
    "userId": "user_123",
    "previousBalance": 100,
    "newBalance": 90,
    "change": -10,
    "reason": "image_generation"
  }
}`}</code>
          </pre>
        </section>

        {/* Signature Verification */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-foreground">Signature Verification</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            All webhook requests include a signature header to verify authenticity. Always verify the signature before processing events.
          </p>

          <h3 className="text-lg font-medium text-foreground mb-3">Verification Headers</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Header</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 font-mono text-orange-500">X-Webhook-Signature</td>
                  <td className="py-3 px-4 text-muted-foreground">HMAC-SHA256 signature of the payload</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-orange-500">X-Webhook-Timestamp</td>
                  <td className="py-3 px-4 text-muted-foreground">Unix timestamp when the webhook was sent</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-foreground mb-3">Node.js Verification Example</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, timestamp, secret) {
  // Check timestamp to prevent replay attacks (5 minute window)
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - parseInt(timestamp) > 300) {
    throw new Error('Webhook timestamp too old');
  }

  // Compute expected signature
  const signedPayload = \`\${timestamp}.\${JSON.stringify(payload)}\`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // Compare signatures
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )) {
    throw new Error('Invalid signature');
  }

  return true;
}

// Usage in Express route
app.post('/webhook', (req, res) => {
  try {
    verifyWebhookSignature(
      req.body,
      req.headers['x-webhook-signature'],
      req.headers['x-webhook-timestamp'],
      process.env.WEBHOOK_SECRET
    );
    
    // Process the webhook event
    const { type, data } = req.body;
    console.log('Received event:', type, data);
    
    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});`}</code>
          </pre>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-foreground">Best Practices</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Respond quickly",
                description: "Return a 2xx response within 30 seconds. Process events asynchronously if needed."
              },
              {
                title: "Handle duplicates",
                description: "Use the event 'id' field to deduplicate. Webhooks may be retried on failure."
              },
              {
                title: "Verify signatures",
                description: "Always verify the webhook signature before trusting the payload."
              },
              {
                title: "Use HTTPS",
                description: "Webhook endpoints must use HTTPS for security."
              },
              {
                title: "Log events",
                description: "Keep logs of received webhooks for debugging and auditing."
              }
            ].map((practice) => (
              <div key={practice.title} className="p-4 rounded-lg border border-border bg-card">
                <div className="font-medium text-foreground mb-1">{practice.title}</div>
                <p className="text-sm text-muted-foreground">{practice.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Retry Policy */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Retry Policy</h2>
          <p className="text-muted-foreground mb-4">
            If your endpoint returns a non-2xx response, we will retry the webhook:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Attempt</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Delay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 text-foreground">1st retry</td>
                  <td className="py-3 px-4 text-muted-foreground">1 minute</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-foreground">2nd retry</td>
                  <td className="py-3 px-4 text-muted-foreground">5 minutes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-foreground">3rd retry</td>
                  <td className="py-3 px-4 text-muted-foreground">30 minutes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-foreground">4th retry</td>
                  <td className="py-3 px-4 text-muted-foreground">2 hours</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-foreground">5th retry (final)</td>
                  <td className="py-3 px-4 text-muted-foreground">24 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
