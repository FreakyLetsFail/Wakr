import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/supabase-server";
import { 
  Phone, 
  Calendar, 
  TrendingUp, 
  Settings, 
  User, 
  LogOut,
  Shield,
  Menu,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserDropdown } from "@/components/ui/user-dropdown";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user needs onboarding
  const hasCompletedOnboarding = user.user_metadata?.onboarding_completed;
  const hasRequiredData = user.user_metadata?.phone && user.user_metadata?.first_name;
  
  if (!hasCompletedOnboarding || !hasRequiredData) {
    redirect("/onboarding");
  }

  const isAdmin = false; // TODO: Add admin role check from user metadata

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Calendar,
    },
    {
      name: "Wake Calls",
      href: "/dashboard/wake-calls",
      icon: Phone,
    },
    {
      name: "Habits",
      href: "/dashboard/habits",
      icon: TrendingUp,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  if (isAdmin) {
    navigation.push({
      name: "Admin Panel",
      href: "/admin",
      icon: Shield,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-wakr flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Wakr</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button variant="ghost" className="gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* User Menu */}
            <div className="flex items-center gap-2 pl-2 border-l">
              <div className="hidden sm:block text-sm">
                <div className="font-medium">{user.user_metadata?.full_name || user.email}</div>
                <div className="text-muted-foreground text-xs">
                  {user.user_metadata?.subscription_tier || 'Trial'}
                </div>
              </div>
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b bg-background">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button variant="ghost" size="sm" className="gap-2 whitespace-nowrap">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}