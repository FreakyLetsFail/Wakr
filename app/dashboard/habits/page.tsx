import { createClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Plus, 
  Clock, 
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { HabitGrid } from "@/components/dashboard/habit-grid";

export default async function HabitsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  
  // Get user's habits with completions
  const { data: habits } = await supabase
    .from('habits')
    .select(`
      *,
      habit_completions(*)
    `)
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  // Get user's coins for gamification
  const { data: userCoins } = await supabase
    .from('user_coins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Calculate statistics for each habit
  const enrichedHabits = habits?.map(habit => {
    const completions = habit.habit_completions || [];
    const today = new Date().toISOString().split('T')[0];
    const completedToday = completions.some(c => 
      c.completed_at.split('T')[0] === today
    );

    // Calculate current streak
    let currentStreak = 0;
    const sortedCompletions = completions
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
    
    for (let i = 0; i < sortedCompletions.length; i++) {
      const completionDate = new Date(sortedCompletions[i].completed_at);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (completionDate.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      ...habit,
      completedToday,
      currentStreak,
      totalCompletions: completions.length,
    };
  }) || [];

  // Generate habit activity grid data (last 30 days for mobile)
  const generateActivityData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Count completions for this date across all habits
      const completionsOnDate = habits?.reduce((count, habit) => {
        const completions = habit.habit_completions || [];
        return count + completions.filter(c => 
          c.completed_at.split('T')[0] === dateStr
        ).length;
      }, 0) || 0;
      
      days.push({
        date: dateStr,
        count: completionsOnDate,
        level: Math.min(Math.floor(completionsOnDate / 2), 4), // 0-4 intensity levels
      });
    }
    
    return days;
  };

  const activityData = generateActivityData();
  const totalCompletions = enrichedHabits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
  const activeHabits = enrichedHabits.length;
  const completedToday = enrichedHabits.filter(h => h.completedToday).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Habits</h1>
          <p className="text-muted-foreground mt-1">
            Verfolge deine täglichen Gewohnheiten und baue Streaks auf
          </p>
        </div>
        <Link href="/dashboard/habits/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Neues Habit
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Habits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeHabits}</div>
            <p className="text-xs text-muted-foreground">
              von 10 möglich
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heute erledigt</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
            <p className="text-xs text-muted-foreground">
              von {activeHabits} Habits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Completions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletions}</div>
            <p className="text-xs text-muted-foreground">
              Alle Habits zusammen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Münzen</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCoins?.current_balance || 0}</div>
            <p className="text-xs text-muted-foreground">
              Level {userCoins?.level || 1}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Habit Activity Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Deine Habit-Aktivität
          </CardTitle>
          <CardDescription>
            Letzten 30 Tage - Je dunkler, desto mehr Habits erledigt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HabitGrid data={activityData} />
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="space-y-4">
        {enrichedHabits.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Noch keine Habits</h3>
              <p className="text-muted-foreground text-center mb-4">
                Erstelle dein erstes Habit und baue eine tägliche Routine auf
              </p>
              <Link href="/dashboard/habits/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Erstes Habit erstellen
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          enrichedHabits.map((habit) => (
            <Card key={habit.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: habit.color + '20', color: habit.color }}
                    >
                      {habit.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {habit.frequency}
                        </Badge>
                        {habit.reminder_enabled && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {habit.reminder_time}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {habit.completedToday ? (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Erledigt
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline">
                        <Circle className="w-4 h-4 mr-1" />
                        Markieren
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">{habit.currentStreak}</div>
                    <div className="text-muted-foreground">Aktuelle Serie</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{habit.longest_streak}</div>
                    <div className="text-muted-foreground">Beste Serie</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{habit.totalCompletions}</div>
                    <div className="text-muted-foreground">Gesamt</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fortschritt diesen Monat</span>
                    <span>{Math.round((habit.totalCompletions / 30) * 100)}%</span>
                  </div>
                  <Progress value={(habit.totalCompletions / 30) * 100} className="h-2" />
                </div>

                {/* Description */}
                {habit.description && (
                  <p className="text-sm text-muted-foreground">{habit.description}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}