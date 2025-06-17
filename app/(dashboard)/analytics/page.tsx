"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Clock, 
  Activity,
  Phone,
  CheckCircle,
  Target,
  Zap
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Track your progress and performance
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Total Calls</p>
                <p className="text-lg font-bold">25</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-lg font-bold">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Avg Wake Time</p>
                <p className="text-lg font-bold">7:15 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Current Streak</p>
                <p className="text-lg font-bold">7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
          <CardDescription>Based on your recent activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
            <div>
              <p className="font-medium">Great consistency!</p>
              <p className="text-sm text-muted-foreground">
                You have maintained a 7 day wake-up streak. Keep it up!
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
            <div>
              <p className="font-medium">Optimal wake time</p>
              <p className="text-sm text-muted-foreground">
                Your average wake time of 7:15 AM aligns well with your goals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}