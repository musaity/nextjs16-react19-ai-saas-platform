import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/config";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight,
  Tag,
  User
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

// Dynamic SEO metadata for Blog page
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();
  const baseUrl = getAppUrl();
  const siteName = settings?.siteName || "AI Creative Studio";
  
  return {
    title: "Blog",
    description: `Latest news, tutorials, and insights about AI creativity from ${siteName}. Learn prompt engineering, AI art techniques, and industry trends.`,
    keywords: ["AI blog", "AI tutorials", "prompt engineering", "AI art", "AI news", "creative AI", siteName],
    openGraph: {
      title: `Blog | ${siteName}`,
      description: "Latest news, tutorials, and insights about AI creativity.",
      url: `${baseUrl}/blog`,
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-blog.png`,
          width: 1200,
          height: 630,
          alt: `${siteName} Blog`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Blog | ${siteName}`,
      description: "Latest news, tutorials, and insights about AI creativity.",
    },
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
  };
}

// Demo blog posts
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with AI Image Generation: A Beginner's Guide",
    excerpt: "Learn the basics of AI image generation and how to craft effective prompts that bring your creative vision to life.",
    category: "Tutorial",
    author: "Sarah Chen",
    date: "February 1, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    slug: "getting-started-ai-image-generation",
  },
  {
    id: 2,
    title: "The Future of AI Video Creation: What's Next in 2026",
    excerpt: "Explore the latest advancements in AI video generation and what they mean for content creators.",
    category: "Industry",
    author: "Michael Lee",
    date: "January 28, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop",
    slug: "future-ai-video-creation-2026",
  },
  {
    id: 3,
    title: "10 Prompt Engineering Tips for Better AI Results",
    excerpt: "Master the art of prompt engineering with these proven techniques used by professional AI artists.",
    category: "Tips & Tricks",
    author: "Emily Wang",
    date: "January 25, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
    slug: "prompt-engineering-tips",
  },
  {
    id: 4,
    title: "How AI is Transforming E-commerce Product Photography",
    excerpt: "Discover how online retailers are using AI to create stunning product images at a fraction of the cost.",
    category: "Case Study",
    author: "Alex Kim",
    date: "January 20, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    slug: "ai-ecommerce-photography",
  },
  {
    id: 5,
    title: "Building an AI-Powered Social Media Strategy",
    excerpt: "Learn how to leverage AI tools to create engaging social media content that drives results.",
    category: "Marketing",
    author: "David Brown",
    date: "January 15, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    slug: "ai-social-media-strategy",
  },
  {
    id: 6,
    title: "Understanding AI Model Differences: DALL-E vs Gemini vs Stable Diffusion",
    excerpt: "A comprehensive comparison of popular AI image models and when to use each one.",
    category: "Guide",
    author: "Sarah Chen",
    date: "January 10, 2026",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    slug: "ai-model-comparison",
  },
];

const categories = ["All", "Tutorial", "Industry", "Tips & Tricks", "Case Study", "Marketing", "Guide"];

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-6 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Latest from Our Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Insights, tutorials, and news about AI creativity and how to make the most of our platform.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-6 border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="aspect-video rounded-2xl overflow-hidden">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {featuredPost.category}
                </span>
                <span className="text-sm text-muted-foreground">Featured</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-muted-foreground mb-6">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {featuredPost.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {featuredPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {featuredPost.readTime}
                </span>
              </div>
              <Button className="gap-2">
                Read Article <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-8">More Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <article 
                key={post.id}
                className="group rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors bg-card"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-muted-foreground mb-6">
            Get the latest AI creativity tips and updates delivered to your inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer Back Link */}
      <div className="py-8 px-6 text-center border-t border-border">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
