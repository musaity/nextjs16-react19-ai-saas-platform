import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Content is hardcoded for now, will be dynamic after database migration
const content = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
  buttonText: "Go Home",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <span className="text-[180px] font-bold text-muted-foreground/10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground">
            {content.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {content.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            {content.buttonText}
          </Link>
        </div>

        {/* Additional Help */}
        <p className="text-sm text-muted-foreground">
          If you believe this is an error, please{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
