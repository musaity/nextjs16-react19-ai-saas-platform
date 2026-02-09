export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="h-8 w-32 bg-muted/50 rounded-lg animate-pulse" />
          <div className="hidden md:flex items-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-16 bg-muted/30 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-10 w-28 bg-primary/20 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="h-8 w-40 bg-muted/30 rounded-full mx-auto mb-6 animate-pulse" />
          
          {/* Title */}
          <div className="space-y-3 mb-6">
            <div className="h-12 w-3/4 bg-muted/40 rounded-lg mx-auto animate-pulse" />
            <div className="h-12 w-1/2 bg-muted/40 rounded-lg mx-auto animate-pulse" />
          </div>
          
          {/* Description */}
          <div className="h-6 w-2/3 bg-muted/30 rounded mx-auto mb-8 animate-pulse" />
          
          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-12 w-40 bg-primary/30 rounded-xl animate-pulse" />
            <div className="h-12 w-36 bg-muted/30 rounded-xl animate-pulse" />
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 w-16 bg-muted/40 rounded mx-auto mb-1 animate-pulse" />
                <div className="h-4 w-20 bg-muted/20 rounded mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Preview Skeleton */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="h-80 bg-muted/20 rounded-2xl border border-border animate-pulse" />
      </div>
    </div>
  );
}
