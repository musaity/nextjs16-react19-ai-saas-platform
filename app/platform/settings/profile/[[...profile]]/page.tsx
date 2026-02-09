import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <UserProfile 
          path="/platform/settings/profile"
          routing="path"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-card border border-border shadow-2xl rounded-2xl",
              navbar: "bg-card border-r border-border",
              navbarButton: "text-muted-foreground hover:text-foreground hover:bg-accent",
              navbarButtonActive: "text-foreground bg-primary/10 border-primary/30",
              pageScrollBox: "bg-card",
              page: "bg-card",
              profilePage: "bg-card",
              profileSection: "bg-card",
              profileSectionTitle: "text-foreground",
              profileSectionTitleText: "text-foreground font-semibold",
              profileSectionContent: "bg-card",
              profileSectionPrimaryButton: "bg-primary hover:bg-primary/90 text-primary-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              formButtonReset: "text-muted-foreground hover:text-foreground",
              formFieldLabel: "text-muted-foreground",
              formFieldInput: "bg-muted border-border text-foreground focus:border-primary",
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              accordionTriggerButton: "text-foreground hover:bg-accent",
              accordionContent: "bg-card",
              badge: "bg-primary/10 text-primary border-primary/30",
              avatarBox: "border-2 border-primary/30",
              userPreviewMainIdentifier: "text-foreground",
              userPreviewSecondaryIdentifier: "text-muted-foreground",
              userButtonPopoverCard: "bg-card border border-border",
              userButtonPopoverActionButton: "text-muted-foreground hover:text-foreground hover:bg-accent",
              userButtonPopoverActionButtonText: "text-muted-foreground",
              userButtonPopoverFooter: "border-t border-border",
              menuButton: "text-muted-foreground hover:text-foreground hover:bg-accent",
              menuList: "bg-card border border-border",
              menuItem: "text-muted-foreground hover:text-foreground hover:bg-accent",
            }
          }}
        />
      </div>
    </div>
  );
}
