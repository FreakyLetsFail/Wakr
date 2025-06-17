"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Plus, 
  Clock, 
  Target,
  Calendar,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Flame,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: string;
  reminderEnabled: boolean;
  reminderTime?: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completions?: any[];
}

interface GridDay {
  date: string;
  completions: number;
  level: number;
}

const HABIT_ICONS = [
  "🧘", "🏃", "📚", "💧", "📝", "🎯", "💊", "🚶", "🍎", "🛌",
  "🎵", "🧠", "🏋️", "🎨", "📱", "🌱", "☕", "🔬", "💭", "⚡"
];

const HABIT_COLORS = [
  "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", 
  "#ec4899", "#14b8a6", "#f97316", "#8b5cf6", "#06b6d4"
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    icon: "📌",
    color: "#7c3aed",
    frequency: "DAILY",
    reminderEnabled: false,
    reminderTime: "08:00",
  });
  const { toast } = useToast();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch habits on component mount
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      if (response.ok) {
        const data = await response.json();
        setHabits(data.habits || []);
      } else {
        throw new Error('Failed to fetch habits');
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast({
        title: "Error",
        description: "Failed to load habits. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // GitHub-style grid data (responsive)
  const generateGridData = (): GridDay[] => {
    const days: GridDay[] = [];
    const today = new Date();
    const startDate = new Date(today);
    
    // Mobile: 30 days, Desktop: 365 days
    const totalDays = isMobile ? 30 : 365;
    startDate.setDate(today.getDate() - (totalDays - 1));

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Calculate completions for this date across all habits
      const dateString = date.toISOString().split('T')[0];
      let dayCompletions = 0;
      
      habits.forEach(habit => {
        if (habit.completions) {
          const completion = habit.completions.find(c => 
            c.completedAt.split('T')[0] === dateString
          );
          if (completion) dayCompletions++;
        }
      });
      
      days.push({
        date: dateString,
        completions: dayCompletions,
        level: dayCompletions === 0 ? 0 : Math.min(Math.floor(dayCompletions / 1) + 1, 4)
      });
    }
    return days;
  };

  const gridData = generateGridData();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const createHabit = async () => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHabit),
      });

      if (response.ok) {
        const data = await response.json();
        setHabits([data.habit, ...habits]);
        setShowCreateForm(false);
        setNewHabit({
          name: "",
          icon: "📌",
          color: "#7c3aed",
          frequency: "DAILY",
          reminderEnabled: false,
          reminderTime: "08:00",
        });
        toast({
          title: "Success!",
          description: "Habit created successfully",
        });
      } else {
        throw new Error('Failed to create habit');
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      toast({
        title: "Error",
        description: "Failed to create habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleHabitCompletion = async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      // Check if already completed today
      const today = new Date().toISOString().split('T')[0];
      const todayCompletion = habit.completions?.find(c => 
        c.completedAt.split('T')[0] === today
      );

      if (todayCompletion) {
        // Uncomplete
        const response = await fetch(`/api/habits/${habitId}/complete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: today }),
        });

        if (response.ok) {
          fetchHabits(); // Refresh data
          toast({
            title: "Uncompleted!",
            description: "Habit completion removed",
          });
        }
      } else {
        // Complete
        const response = await fetch(`/api/habits/${habitId}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          const data = await response.json();
          fetchHabits(); // Refresh data
          toast({
            title: "Completed! 🎉",
            description: `${data.coinsAwarded} coins earned!`,
          });
        }
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      toast({
        title: "Error",
        description: "Failed to update habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHabits(habits.filter(h => h.id !== habitId));
        toast({
          title: "Deleted",
          description: "Habit deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    }
  };

  const getTodayCompletions = () => {
    const today = new Date().toISOString().split('T')[0];
    return habits.filter(habit => 
      habit.completions?.some(c => c.completedAt.split('T')[0] === today)
    ).length;
  };

  const getTotalActiveHabits = () => habits.length;

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Habit Tracking</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Build consistency and achieve your goals
          </p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
              <DialogDescription>
                Add a new habit to track your progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Habit Name</Label>
                <Input
                  id="name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  placeholder="e.g., Morning meditation"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Icon</Label>
                  <Select value={newHabit.icon} onValueChange={(value) => setNewHabit({...newHabit, icon: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg">
                      {HABIT_ICONS.map(icon => (
                        <SelectItem key={icon} value={icon}>
                          <span className="text-lg">{icon}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Color</Label>
                  <Select value={newHabit.color} onValueChange={(value) => setNewHabit({...newHabit, color: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-lg">
                      {HABIT_COLORS.map(color => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{backgroundColor: color}}></div>
                            {color}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="reminder"
                  checked={newHabit.reminderEnabled}
                  onCheckedChange={(checked) => setNewHabit({...newHabit, reminderEnabled: checked})}
                />
                <Label htmlFor="reminder">Enable reminder</Label>
              </div>

              {newHabit.reminderEnabled && (
                <div>
                  <Label htmlFor="time">Reminder Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newHabit.reminderTime}
                    onChange={(e) => setNewHabit({...newHabit, reminderTime: e.target.value})}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={createHabit} className="flex-1" disabled={!newHabit.name.trim()}>
                  Create Habit
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-lg font-bold">{getTodayCompletions()}/{getTotalActiveHabits()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Best Streak</p>
                <p className="text-lg font-bold">{Math.max(...habits.map(h => h.longestStreak), 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{habits.reduce((sum, h) => sum + h.totalCompletions, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-lg font-bold">{getTotalActiveHabits()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habits Grid */}
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Your Habits</h2>
        {habits.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first habit to start tracking your progress
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {habits.map((habit) => {
              const today = new Date().toISOString().split('T')[0];
              const isCompletedToday = habit.completions?.some(c => 
                c.completedAt.split('T')[0] === today
              );

              return (
                <Card key={habit.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Button
                          variant={isCompletedToday ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0 rounded-full"
                          style={isCompletedToday ? {backgroundColor: habit.color} : {}}
                          onClick={() => toggleHabitCompletion(habit.id)}
                        >
                          {isCompletedToday ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{habit.icon}</span>
                            <h3 className="font-semibold">{habit.name}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {habit.currentStreak} day streak
                            </span>
                            <span>{habit.totalCompletions} completed</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {habit.reminderEnabled && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {habit.reminderTime}
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteHabit(habit.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity Grid - GitHub Style */}
      {habits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Overview</CardTitle>
            <CardDescription>
              {isMobile ? "Last 30 days" : "Last 12 months"} of habit completions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Month labels for desktop */}
              {!isMobile && (
                <div className="grid grid-cols-12 gap-1 text-xs text-muted-foreground mb-2">
                  {months.map((month, i) => (
                    <div key={i} className="text-center">{month}</div>
                  ))}
                </div>
              )}
              
              {/* Activity grid */}
              <div className={`grid gap-1 ${isMobile ? 'grid-cols-10' : 'grid-cols-15'}`}>
                {gridData.map((day, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-sm border border-muted"
                    style={{
                      backgroundColor: day.level === 0 ? 'transparent' : 
                        day.level === 1 ? '#0d4d0d' :
                        day.level === 2 ? '#1a5e1a' :
                        day.level === 3 ? '#2d8f2d' :
                        '#40c040'
                    }}
                    title={`${day.date}: ${day.completions} completions`}
                  />
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className="w-3 h-3 rounded-sm border border-muted"
                      style={{
                        backgroundColor: level === 0 ? 'transparent' : 
                          level === 1 ? '#0d4d0d' :
                          level === 2 ? '#1a5e1a' :
                          level === 3 ? '#2d8f2d' :
                          '#40c040'
                      }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}