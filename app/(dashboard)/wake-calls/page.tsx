import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Phone, 
  Clock, 
  Settings, 
  TestTube,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

async function WakeCallsContent() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  // Mock data - will be replaced with real data from database
  const wakeCalls = [
    {
      id: 1,
      enabled: true,
      wakeTime: '07:00',
      daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
      challengeType: 'math',
      challengeDifficulty: 2,
      snoozeAllowed: true,
      maxSnoozes: 3,
      voiceVariant: 'friendly',
      totalCalls: 25,
      successfulCalls: 23
    }
  ];

  const getDayName = (dayNum: number) => {
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    return days[dayNum];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wake-Up Calls</h1>
          <p className="text-muted-foreground mt-1">
            Configure your personalized wake-up calls and challenges
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Wake Call
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <TestTube className="h-4 w-4" />
          Test Call
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Voice Settings
        </Button>
      </div>

      {/* Wake Calls List */}
      <div className="space-y-4">
        {wakeCalls.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Phone className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Wake Calls Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first wake-up call to start your morning routine
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Wake Call
              </Button>
            </CardContent>
          </Card>
        ) : (
          wakeCalls.map((call) => (
            <Card key={call.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{call.wakeTime}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {call.daysOfWeek.map(day => getDayName(day)).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={call.enabled} />
                    <Badge variant={call.enabled ? 'default' : 'secondary'}>
                      {call.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Challenge Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Challenge</p>
                    <p className="font-medium capitalize">{call.challengeType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Difficulty</p>
                    <p className="font-medium">{call.challengeDifficulty}/5</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Snooze</p>
                    <p className="font-medium">
                      {call.snoozeAllowed ? `Max ${call.maxSnoozes}x` : 'Disabled'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Voice</p>
                    <p className="font-medium capitalize">{call.voiceVariant}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{call.totalCalls}</p>
                    <p className="text-xs text-muted-foreground">Total Calls</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round((call.successfulCalls / call.totalCalls) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Usage Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage & Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Active Wake Calls</p>
              <p className="text-xs text-muted-foreground mt-1">
                {session.user.subscriptionTier === 'PRO' ? 'Unlimited' : 'Max 3 on Basic'}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">25</p>
              <p className="text-sm text-muted-foreground">Calls This Month</p>
              <p className="text-xs text-muted-foreground mt-1">
                No limits on calls
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">92%</p>
              <p className="text-sm text-muted-foreground">Overall Success</p>
              <p className="text-xs text-muted-foreground mt-1">
                Last 30 days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function WakeCallsPage() {
  return (
    <Suspense fallback={<div>Loading wake calls...</div>}>
      <WakeCallsContent />
    </Suspense>
  );
}