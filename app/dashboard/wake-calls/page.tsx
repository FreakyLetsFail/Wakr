import { Suspense } from 'react';
import { createClient } from '@/lib/supabase-server';
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
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // Get real wake calls from database
  const { data: wakeCalls } = await supabase
    .from('wake_calls')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Get call logs for statistics
  const { data: callLogs } = await supabase
    .from('call_logs')
    .select('*')
    .eq('user_id', user.id);

  // Enrich wake calls with statistics
  const enrichedWakeCalls = wakeCalls?.map(call => {
    const callsForThisWakeCall = callLogs?.filter(log => log.wake_call_id === call.id) || [];
    const successfulCalls = callsForThisWakeCall.filter(log => log.status === 'COMPLETED').length;
    
    return {
      ...call,
      totalCalls: callsForThisWakeCall.length,
      successfulCalls,
      successRate: callsForThisWakeCall.length > 0 ? 
        Math.round((successfulCalls / callsForThisWakeCall.length) * 100) : 0
    };
  }) || [];

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
        {enrichedWakeCalls.length === 0 ? (
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
          enrichedWakeCalls.map((call) => (
            <Card key={call.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{call.wake_time}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {call.days_of_week ? 
                          call.days_of_week.map(day => getDayName(day)).join(', ') : 
                          'Täglich'
                        }
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
                    <p className="font-medium capitalize">{call.challenge_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Difficulty</p>
                    <p className="font-medium">{call.challenge_difficulty}/5</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Snooze</p>
                    <p className="font-medium">
                      {call.snooze_allowed ? `Max ${call.max_snoozes}x` : 'Disabled'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Voice</p>
                    <p className="font-medium capitalize">{call.voice_variant}</p>
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
                      {call.successRate}%
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

      {/* Tips & Help */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Tipps für bessere Weckrufe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Erfolgreiche Routinen</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Stelle dein Handy außer Reichweite auf</li>
                <li>• Aktiviere Challenges für besseres Aufwachen</li>
                <li>• Verwende verschiedene Weckzeiten für Wochenenden</li>
                <li>• Kopple Weckrufe mit Habit-Erinnerungen</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Voice & Challenges</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Wähle eine angenehme Stimme</li>
                <li>• Starte mit einfachen Math-Challenges</li>
                <li>• Erhöhe die Schwierigkeit graduell</li>
                <li>• Teste neue Challenge-Typen regelmäßig</li>
              </ul>
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