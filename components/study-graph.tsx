"use client";

// import { useStudy } from "@/lib/study-context"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { BarChart3, TrendingUp, Clock, Award } from "lucide-react";

interface streakData {
  totalDurationMinutes: number;
  averageStudy: {
    sevenDaysHours: number;
    sevenDaysAvg: number;
  };
}

export function StudyGraph() {
  const [apiData, setApiData] = useState<streakData>({
    totalDurationMinutes: 0,
    averageStudy: {
      sevenDaysHours: 0,
      sevenDaysAvg: 0,
    },    
  });

  const handleApiData = async () => {
    const res = await fetch("/api/analytics/streaks");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data: streakData = await res.json();
    // console.log(data);
    setApiData(data);
  };

  useEffect(() => {
    handleApiData();
  }, []);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <BarChart3 className="h-4 w-4 text-primary" />
          Study Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Total
            </div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {apiData ? (apiData.totalDurationMinutes / 60).toFixed(1) : 0}h
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Average
            </div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {apiData ? apiData.averageStudy.sevenDaysAvg : 0}h
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Award className="h-3 w-3" />
              Best Day
            </div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {/* {bestDay.toFixed(1)}h */}
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            Weekly Overview
          </div>
          <ChartContainer
            config={{
              hours: {
                label: "Hours",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[160px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                // data={weeklyData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-hours)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-hours)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `${value}h`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="var(--color-hours)"
                  strokeWidth={2}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Bar Chart */}
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            Daily Comparison
          </div>
          <ChartContainer
            config={{
              hours: {
                label: "Hours",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[100px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                // data={weeklyData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="hours"
                  fill="var(--color-hours)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
