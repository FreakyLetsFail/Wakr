import { Suspense } from 'react';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Zap,
  Phone,
  CheckCircle2,
  Flame,
  Download
} from 'lucide-react';

async function AnalyticsContent() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // Mock analytics data - will be replaced with real data
  const analytics = {
    overview: {
      totalWakeCalls: 156,
      successfulCalls: 142,
      averageWakeTime: '07:12',
      totalHabits: 8,
      activeHabits: 5,
      completedToday: 3,
      currentStreak: 12,
      longestStreak: 23,
      totalCoins: 1450,
      level: 7
    },
    weeklyStats: [
      { day: 'Mo', wakeCalls: 1, habitsCompleted: 4, success: true },
      { day: 'Di', wakeCalls: 1, habitsCompleted: 3, success: true },
      { day: 'Mi', wakeCalls: 1, habitsCompleted: 5, success: true },
      { day: 'Do', wakeCalls: 1, habitsCompleted: 2, success: false },
      { day: 'Fr', wakeCalls: 1, habitsCompleted: 4, success: true },
      { day: 'Sa', wakeCalls: 0, habitsCompleted: 3, success: true },
      { day: 'So', wakeCalls: 0, habitsCompleted: 2, success: true }
    ],
    monthlyTrends: {
      wakeCallSuccess: [85, 88, 92, 89, 91, 94, 92, 96, 93, 95, 91, 97],
      habitCompletion: [72, 75, 78, 82, 85, 88, 84, 87, 89, 92, 88, 91],
      streakDays: [5, 8, 12, 7, 15, 18, 11, 16, 20, 23, 14, 19]
    },
    topHabits: [
      { name: 'Meditation', completions: 28, streak: 7, success: 93 },
      { name: 'Exercise', completions: 25, streak: 5, success: 89 },
      { name: 'Reading', completions: 22, streak: 3, success: 85 },
      { name: 'Water', completions: 30, streak: 12, success: 97 },
      { name: 'Journaling', completions: 18, streak: 2, success: 78 }
    ],
    achievements: [
      { name: 'Early Bird', icon: '🌅', unlockedAt: '2025-06-01', coins: 100 },
      { name: 'Week Warrior', icon: '💪', unlockedAt: '2025-06-05', coins: 150 },
      { name: 'Consistent', icon: '🔥', unlockedAt: '2025-06-10', coins: 200 },
      { name: 'Morning Master', icon: '👑', unlockedAt: '2025-06-12', coins: 500 }
    ]
  };

  const { overview } = analytics;
  const successRate = Math.round((overview.successfulCalls / overview.totalWakeCalls) * 100);
  const habitCompletionRate = Math.round((overview.completedToday / overview.activeHabits) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Detailed insights into your wake-up calls and habits
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Level {overview.level}
          </Badge>
          <Badge className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {overview.totalCoins} Coins
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {overview.successfulCalls}/{overview.totalWakeCalls} calls successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{overview.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              Longest: {overview.longestStreak} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Wake Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.averageWakeTime}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{habitCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {overview.completedToday}/{overview.activeHabits} habits done
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Weekly View */}
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                This Week's Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {analytics.weeklyStats.map((day, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="text-sm font-medium">{day.day}</div>
                    <div className="space-y-1">
                      <div className={`h-16 w-full rounded-lg flex items-end justify-center ${
                        day.success ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                      }`}>
                        <div 
                          className={`w-full rounded-lg ${
                            day.success ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ height: `${Math.max(day.habitsCompleted * 10, 8)}px` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.habitsCompleted} habits
                      </div>
                      {day.wakeCalls > 0 && (
                        <div className={`w-2 h-2 rounded-full mx-auto ${
                          day.success ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wake Call Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Scheduled Calls</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Successful</span>
                  <span className="font-semibold text-green-600">4</span>
                </div>
                <div className="flex justify-between">
                  <span>Missed</span>
                  <span className="font-semibold text-red-600">1</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Snoozes</span>
                  <span className="font-semibold">1.2</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Habit Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Completions</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Average</span>
                  <span className="font-semibold">3.3</span>
                </div>
                <div className="flex justify-between">
                  <span>Best Day</span>
                  <span className="font-semibold">Wednesday (5)</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Rate</span>
                  <span className="font-semibold text-green-600">82%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monthly View */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monthly Trends (Last 12 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Wake Call Success Rate</h4>
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    {analytics.monthlyTrends.wakeCallSuccess.map((rate, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className="bg-blue-500 rounded-t mb-1"
                          style={{ height: `${rate}px` }}
                        />
                        <div className="text-xs text-muted-foreground">
                          {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Habit Completion Rate</h4>
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    {analytics.monthlyTrends.habitCompletion.map((rate, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className="bg-green-500 rounded-t mb-1"
                          style={{ height: `${rate}px` }}
                        />
                        <div className="text-xs text-muted-foreground">
                          {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Habits Analysis */}
        <TabsContent value="habits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Top Performing Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topHabits.map((habit, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{habit.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {habit.completions} completions this month
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{habit.success}% success</Badge>
                        <Badge variant="secondary">{habit.streak} day streak</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {analytics.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      +{achievement.coins} coins
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievement Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Unstoppable (30-day streak)</span>
                  <span className="text-sm text-muted-foreground">{overview.currentStreak}/30</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${Math.min((overview.currentStreak / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Century Club (100 wake calls)</span>
                  <span className="text-sm text-muted-foreground">{overview.totalWakeCalls}/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${Math.min((overview.totalWakeCalls / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}