import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-card p-2 rounded-2xl border border-border shadow-2xl">
        {/* Clerk's built-in sign-in form */}
        <SignIn appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
            footerActionLink: "text-primary hover:text-primary/80",
            card: "bg-transparent shadow-none",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "bg-muted border-border text-foreground hover:bg-accent",
            formFieldLabel: "text-muted-foreground",
            formFieldInput: "bg-muted border-border text-foreground",
            identityPreviewText: "text-muted-foreground",
            identityPreviewEditButton: "text-primary",
          }
        }} />
      </div>
    </div>
  );
}