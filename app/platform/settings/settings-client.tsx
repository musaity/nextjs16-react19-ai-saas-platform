"use client";

import { Button } from "@/app/components/ui/button";
import { 
  Settings,
  User,
  Shield,
  CreditCard,
  ChevronDown,
  Loader2,
  Mail,
  Key,
  Smartphone,
  LogOut,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser, useClerk } from "@clerk/nextjs";

interface SettingsClientProps {
  user: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    email: string;
  };
  dbUser: {
    credits?: number;
    email?: string;
    createdAt?: Date;
  } | null;
  settingsSections?: any[];
}

interface UserPreferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  apiAccessEnabled: boolean;
}

type AccordionSection = "profile" | "security" | "billing" | "preferences" | "danger" | null;

export default function SettingsClient({ 
  user, 
  dbUser, 
}: SettingsClientProps) {
  const { user: clerkUser, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  
  const [openSection, setOpenSection] = useState<AccordionSection>("profile");
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    marketingEmails: false,
    apiAccessEnabled: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const toggleSection = (section: AccordionSection) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleToggle = (key: keyof UserPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      toast.success("Preferences saved successfully!");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateName = async () => {
    if (!clerkUser) return;
    setIsUpdatingName(true);
    try {
      await clerkUser.update({
        firstName,
        lastName,
      });
      setIsEditingName(false);
      toast.success("Name updated successfully!");
    } catch {
      toast.error("Failed to update name");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleOpenClerkProfile = () => {
    openUserProfile();
  };

  const AccordionHeader = ({ 
    section, 
    icon: Icon, 
    title, 
    description,
    variant = "default"
  }: { 
    section: AccordionSection; 
    icon: React.ElementType; 
    title: string; 
    description: string;
    variant?: "default" | "danger";
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
        variant === "danger" 
          ? "hover:bg-red-500/5" 
          : "hover:bg-accent"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border ${
          variant === "danger"
            ? "bg-red-500/10 border-red-500/20"
            : "bg-violet-500/10 border-violet-500/20"
        }`}>
          <Icon className={`w-4 h-4 ${variant === "danger" ? "text-red-400" : "text-violet-400"}`} />
        </div>
        <div className="text-left">
          <h3 className={`font-semibold ${variant === "danger" ? "text-red-400" : "text-foreground"}`}>
            {title}
          </h3>
          <p className={`text-xs ${variant === "danger" ? "text-red-400/60" : "text-muted-foreground"}`}>
            {description}
          </p>
        </div>
      </div>
      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
        openSection === section ? "rotate-180" : ""
      } ${variant === "danger" ? "text-red-400/50" : "text-muted-foreground"}`} />
    </button>
  );

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
      style={{ backgroundColor: enabled ? '#8b5cf6' : '#4b5563' }}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20">
                <Settings className="w-6 h-6 text-violet-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Account Settings</h1>
            </div>
            <p className="text-muted-foreground">Manage your account preferences and security settings.</p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="surface rounded-2xl border border-border p-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-glow overflow-hidden">
              {clerkUser?.imageUrl ? (
                <img src={clerkUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">
                {clerkUser?.firstName} {clerkUser?.lastName || ""}
              </h2>
              <p className="text-muted-foreground text-sm">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
              <p className="text-muted-foreground/50 text-xs mt-1">
                Member since {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Unknown"}
              </p>
            </div>
            <div className="text-right">
              <div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <p className="text-xs text-muted-foreground">Available Credits</p>
                <p className="text-2xl font-bold text-violet-400">{dbUser?.credits || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          
          {/* Profile Section */}
          <div className="surface rounded-2xl border border-border overflow-hidden">
            <AccordionHeader 
              section="profile" 
              icon={User} 
              title="Profile Information" 
              description="Update your name and profile photo"
            />
            {openSection === "profile" && (
              <div className="px-6 py-4 border-t border-border space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 overflow-hidden">
                      {clerkUser?.imageUrl ? (
                        <img src={clerkUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-10 h-10 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Profile Photo</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleOpenClerkProfile}
                    className="text-sm"
                  >
                    Change Photo
                  </Button>
                </div>

                {/* Name */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">Full Name</p>
                    {!isEditingName && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditingName(true)}
                        className="text-violet-400 hover:text-violet-300"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                  {isEditingName ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50"
                        />
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdateName}
                          disabled={isUpdatingName}
                          className="bg-violet-600 hover:bg-violet-500"
                        >
                          {isUpdatingName ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsEditingName(false);
                            setFirstName(user.firstName);
                            setLastName(user.lastName);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground px-4 py-3 bg-muted rounded-xl">
                      {clerkUser?.firstName} {clerkUser?.lastName || "—"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium text-foreground">Email Address</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleOpenClerkProfile}
                      className="text-violet-400 hover:text-violet-300"
                    >
                      Manage
                    </Button>
                  </div>
                  <p className="text-muted-foreground px-4 py-3 bg-muted rounded-xl flex items-center justify-between">
                    {clerkUser?.primaryEmailAddress?.emailAddress}
                    {clerkUser?.primaryEmailAddress?.verification.status === "verified" && (
                      <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">Verified</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="surface rounded-2xl border border-border overflow-hidden">
            <AccordionHeader 
              section="security" 
              icon={Shield} 
              title="Security" 
              description="Password and two-factor authentication"
            />
            {openSection === "security" && (
              <div className="px-6 py-4 border-t border-border space-y-4">
                {/* Password */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Key className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Password</p>
                      <p className="text-sm text-muted-foreground">Change your account password</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleOpenClerkProfile}>
                    Change Password
                  </Button>
                </div>

                {/* Two-Factor Auth */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        {clerkUser?.twoFactorEnabled 
                          ? "Enabled - Your account has extra security" 
                          : "Not enabled - Add extra security to your account"}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleOpenClerkProfile}
                    className={clerkUser?.twoFactorEnabled ? "text-emerald-400" : ""}
                  >
                    {clerkUser?.twoFactorEnabled ? "Manage" : "Enable"}
                  </Button>
                </div>

                {/* Active Sessions */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <LogOut className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Active Sessions</p>
                      <p className="text-sm text-muted-foreground">Manage your active sessions and sign out remotely</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleOpenClerkProfile}>
                    View Sessions
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Billing Section */}
          <div className="surface rounded-2xl border border-border overflow-hidden">
            <AccordionHeader 
              section="billing" 
              icon={CreditCard} 
              title="Billing & Credits" 
              description="Manage your subscription and credits"
            />
            {openSection === "billing" && (
              <div className="px-6 py-4 border-t border-border space-y-4">
                {/* Current Credits */}
                <div className="p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Available Credits</p>
                      <p className="text-3xl font-bold text-foreground">{dbUser?.credits || 0}</p>
                    </div>
                    <a href="/platform/billing">
                      <Button className="bg-violet-600 hover:bg-violet-500">
                        Buy More Credits
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Billing Links */}
                <a 
                  href="/platform/billing" 
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div>
                    <p className="font-medium text-foreground group-hover:text-violet-400 transition-colors">Purchase History</p>
                    <p className="text-sm text-muted-foreground">View your past purchases and invoices</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90" />
                </a>
              </div>
            )}
          </div>

          {/* Preferences Section */}
          <div className="surface rounded-2xl border border-border overflow-hidden">
            <AccordionHeader 
              section="preferences" 
              icon={Settings} 
              title="Preferences" 
              description="Communication and notification settings"
            />
            {openSection === "preferences" && (
              <div className="border-t border-border">
                <div className="divide-y divide-border">
                  {/* Email Notifications */}
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-accent transition-colors">
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates about your account activity</p>
                    </div>
                    <Toggle 
                      enabled={preferences.emailNotifications} 
                      onToggle={() => handleToggle('emailNotifications')} 
                    />
                  </div>

                  {/* Marketing Emails */}
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-accent transition-colors">
                    <div>
                      <p className="font-medium text-foreground">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive news and special offers</p>
                    </div>
                    <Toggle 
                      enabled={preferences.marketingEmails} 
                      onToggle={() => handleToggle('marketingEmails')} 
                    />
                  </div>

                  {/* API Access */}
                  <div className="px-6 py-4 flex items-center justify-between hover:bg-accent transition-colors">
                    <div>
                      <p className="font-medium text-foreground">API Access</p>
                      <p className="text-sm text-muted-foreground">Allow API access for integrations</p>
                    </div>
                    <Toggle 
                      enabled={preferences.apiAccessEnabled} 
                      onToggle={() => handleToggle('apiAccessEnabled')} 
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="px-6 py-4 border-t border-border flex justify-end">
                  <Button
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className="bg-violet-600 hover:bg-violet-500 gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Save Preferences</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="surface rounded-2xl border border-red-500/20 overflow-hidden">
            <AccordionHeader 
              section="danger" 
              icon={Trash2} 
              title="Danger Zone" 
              description="Irreversible and destructive actions"
              variant="danger"
            />
            {openSection === "danger" && (
              <div className="px-6 py-6 border-t border-red-500/10 space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                  <div>
                    <p className="font-medium text-foreground">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data. This action cannot be undone.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleOpenClerkProfile}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                  >
                    Delete Account
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to Clerk to confirm account deletion.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}