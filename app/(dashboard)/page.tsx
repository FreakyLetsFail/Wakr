import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Zap,
  ChevronRight,
  Plus,
  Target,
  Flame,
  Award,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
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

  // Mock data - will be replaced with real database queries
  const stats = {
    totalCalls: 42,
    successRate: 95,
    currentStreak: 7,
    activeHabits: 3,
    todayHabits: 2,
    totalHabits: 3,
  };

  const quickHabits = [
    { id: 1, name: "Meditation", icon: "🧘", completed: true },
    { id: 2, name: "Exercise", icon: "🏃", completed: false },
    { id: 3, name: "Reading", icon: "📚", completed: false },
  ];

  const upcomingCalls = [
    {
      id: 1,
      time: "07:00",
      days: "Mon-Fri",
      enabled: true,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "call_completed",
      message: "Wake call completed at 07:00",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "habit_completed",
      message: "Completed 'Meditation' habit",
      time: "3 hours ago",
    },
    {
      id: 3,
      type: "coins_earned",
      message: "Earned 10 coins for habit completion",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Good morning, {user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Here's your overview for today
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/habits">
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              View Habits
            </Button>
          </Link>
          <Link href="/wake-calls">
            <Button size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Wake Calls
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wake Calls
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2% this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Habits
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats.todayHabits}/{stats.totalHabits}</div>
            <p className="text-xs text-muted-foreground">
              habits completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Habits */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Habits - Quick Actions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Today's Habits</CardTitle>
              <CardDescription>Quick habit completion</CardDescription>
            </div>
            <Link href="/habits">
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickHabits.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Create your first habit to start tracking progress
                </p>
                <Link href="/habits">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Habit
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {quickHabits.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Button
                        variant={habit.completed ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        {habit.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs">○</span>
                        )}
                      </Button>
                      <span className="text-lg">{habit.icon}</span>
                      <div>
                        <p className="font-medium">{habit.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {habit.completed ? "Completed today" : "Not completed"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {habit.completed && (
                        <Award className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Link href="/habits">
                    <Button variant="ghost" className="w-full" size="sm">
                      View All Habits
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Wake Call Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wake Call Settings</CardTitle>
            <CardDescription>Your active wake call schedules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${call.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <p className="font-medium">{call.time}</p>
                    <p className="text-sm text-muted-foreground">{call.days}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    call.enabled 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                  }`}>
                    {call.enabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
            <Link href="/wake-calls">
              <Button variant="outline" className="w-full" size="sm">
                Manage Wake Calls
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Your latest wake calls and habit completions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 last:pb-0 border-b last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <Link href="/analytics">
              <Button variant="ghost" className="w-full" size="sm">
                View Full Activity
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}