"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HabitGridProps {
  data: Array<{
    date: string;
    count: number;
    level: number; // 0-4
  }>;
}

export function HabitGrid({ data }: HabitGridProps) {
  const getIntensityColor = (level: number) => {
    const colors = [
      'bg-muted/50', // 0 - keine Aktivität
      'bg-green-100', // 1 - wenig
      'bg-green-300', // 2 - mittel
      'bg-green-500', // 3 - hoch
      'bg-green-700', // 4 - sehr hoch
    ];
    return colors[level] || colors[0];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
    });
  };

  // Split data into weeks for grid layout
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Desktop View - Grid layout */}
        <div className="hidden md:block">
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.map((day) => (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${getIntensityColor(
                          day.level
                        )}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{formatDate(day.date)}</p>
                      <p className="text-sm">
                        {day.count === 0
                          ? 'Keine Habits erledigt'
                          : `${day.count} Habit${day.count > 1 ? 's' : ''} erledigt`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View - Horizontal scrolling */}
        <div className="md:hidden">
          <div className="flex gap-1 overflow-x-auto pb-2">
            {data.map((day) => (
              <Tooltip key={day.date}>
                <TooltipTrigger asChild>
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-lg cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 flex items-center justify-center ${getIntensityColor(
                        day.level
                      )}`}
                    >
                      <span className="text-xs font-medium text-gray-700">
                        {new Date(day.date).getDate()}
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{formatDate(day.date)}</p>
                  <p className="text-sm">
                    {day.count === 0
                      ? 'Keine Habits erledigt'
                      : `${day.count} Habit${day.count > 1 ? 's' : ''} erledigt`}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Weniger</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
              />
            ))}
          </div>
          <span>Mehr</span>
        </div>
      </div>
    </TooltipProvider>
  );
}