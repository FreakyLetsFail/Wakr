import { getUser } from "@/lib/supabase-server";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Zap,
  ChevronRight
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

  // Real data from database
  const supabase = await createClient();
  
  // Get user's profile data
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get wake calls
  const { data: wakeCalls } = await supabase
    .from('wake_calls')
    .select('*')
    .eq('user_id', user.id)
    .eq('enabled', true);

  // Get call logs for statistics
  const { data: callLogs } = await supabase
    .from('call_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30);

  // Get habits
  const { data: habits } = await supabase
    .from('habits')
    .select('*, habit_completions(*)')
    .eq('user_id', user.id)
    .eq('is_archived', false);

  // Get recent habit completions
  const { data: recentCompletions } = await supabase
    .from('habit_completions')
    .select('*, habits(name)')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(5);

  // Calculate statistics
  const totalCalls = callLogs?.length || 0;
  const successfulCalls = callLogs?.filter(call => call.status === 'COMPLETED').length || 0;
  const successRate = totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 0;
  
  // Calculate current streak
  let currentStreak = 0;
  if (callLogs && callLogs.length > 0) {
    const sortedCalls = callLogs.sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime());
    for (let i = 0; i < sortedCalls.length; i++) {
      if (sortedCalls[i].status === 'COMPLETED') {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  const activeHabits = habits?.length || 0;

  const stats = {
    totalCalls,
    successRate,
    currentStreak,
    activeHabits,
  };

  // Format wake calls for display
  const upcomingCalls = wakeCalls?.slice(0, 3).map(call => ({
    id: call.id,
    time: call.wake_time,
    days: call.days_of_week ? 
      call.days_of_week.map(d => ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][d]).join(', ') :
      'Täglich',
    enabled: call.enabled,
  })) || [];

  // Format recent activity
  const recentActivity = [
    // Recent call completions
    ...callLogs?.slice(0, 3).map(call => ({
      id: `call-${call.id}`,
      type: 'call_completed',
      message: call.status === 'COMPLETED' ? 
        `Weckruf erfolgreich um ${call.scheduled_time.split('T')[1]?.substring(0, 5)}` :
        `Weckruf ${call.status.toLowerCase()} um ${call.scheduled_time.split('T')[1]?.substring(0, 5)}`,
      time: new Date(call.created_at).toLocaleDateString('de-DE'),
    })) || [],
    // Recent habit completions
    ...recentCompletions?.slice(0, 2).map(completion => ({
      id: `habit-${completion.id}`,
      type: 'habit_completed',
      message: `Habit '${completion.habits?.name}' abgeschlossen`,
      time: new Date(completion.completed_at).toLocaleDateString('de-DE'),
    })) || [],
  ].slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Guten Morgen, {user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || 'User'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Hier ist deine Übersicht für heute
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weckrufe gesamt
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCalls > 0 ? '+12% vom letzten Monat' : 'Noch keine Anrufe'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Erfolgsrate
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCalls > 0 ? '+2% diese Woche' : 'Keine Daten verfügbar'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktuelle Serie
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              {stats.currentStreak > 0 ? 'Tage in Folge' : 'Noch keine Serie gestartet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktive Habits
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeHabits}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeHabits > 0 ? 'von 10 möglich' : 'Noch keine Habits erstellt'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Calls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Nächste Weckrufe
            </CardTitle>
            <CardDescription>
              Deine konfigurierten Weckzeiten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingCalls.length > 0 ? (
              <>
                {upcomingCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-medium">{call.time}</div>
                        <div className="text-sm text-muted-foreground">{call.days}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-muted-foreground">Aktiv</span>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/wake-calls">
                  <Button variant="ghost" className="w-full justify-between">
                    Weckrufe verwalten
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground text-sm mb-4">
                  Noch keine Weckrufe konfiguriert
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Erstelle deinen ersten Weckruf um loszulegen
                </p>
                <Link href="/dashboard/wake-calls">
                  <Button variant="outline" size="sm">
                    Weckruf erstellen
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Letzte Aktivität
            </CardTitle>
            <CardDescription>
              Was ist zuletzt passiert
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length > 0 ? (
              <>
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm">{activity.message}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/habits">
                  <Button variant="ghost" className="w-full justify-between">
                    Alle Habits ansehen
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground text-sm mb-4">
                  Noch keine Aktivität vorhanden
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Erstelle Weckrufe oder Habits um hier Aktivitäten zu sehen
                </p>
                <Link href="/dashboard/habits">
                  <Button variant="outline" size="sm">
                    Habits ansehen
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Setup */}
      {(stats.totalCalls === 0 && stats.activeHabits === 0) && (
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle>Willkommen bei Wakr! 🎉</CardTitle>
            <CardDescription>
              Lass uns deinen ersten Weckruf einrichten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/wake-calls">
                <Button className="w-full sm:w-auto">
                  <Phone className="w-4 h-4 mr-2" />
                  Ersten Weckruf erstellen
                </Button>
              </Link>
              <Link href="/dashboard/habits">
                <Button variant="outline" className="w-full sm:w-auto">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Habits hinzufügen
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}