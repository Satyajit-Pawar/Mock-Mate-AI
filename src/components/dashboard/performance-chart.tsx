"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { InterviewSession } from "@/lib/types";
import { format } from "date-fns";

type PerformanceChartProps = {
  data: InterviewSession[];
};

const chartConfig = {
    score: {
        label: "Score",
        color: "hsl(var(--primary))",
    },
};

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data
    .map(session => ({
      date: format(session.createdAt.toDate(), "MMM d"),
      score: session.feedback.overallScore,
    }))
    .reverse();

  return (
    <Card>
    <CardHeader>
        <CardTitle>Performance Trend</CardTitle>
        <CardDescription>Your average scores over your last interview sessions.</CardDescription>
    </CardHeader>
    <CardContent>
        {data.length > 1 ? (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
            />
            <YAxis
                dataKey="score"
                domain={[0, 10]}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
            />
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
                <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                <stop
                    offset="5%"
                    stopColor="var(--color-score)"
                    stopOpacity={0.8}
                />
                <stop
                    offset="95%"
                    stopColor="var(--color-score)"
                    stopOpacity={0.1}
                />
                </linearGradient>
            </defs>
            <Area 
                dataKey="score" 
                type="natural"
                fill="url(#fillScore)"
                stroke="var(--color-score)"
                stackId="a" 
            />
            </AreaChart>
        </ChartContainer>
        ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-center bg-muted/50 rounded-lg p-6">
            <p className="font-semibold text-lg">Not enough data yet.</p>
            <p className="text-sm text-muted-foreground">Complete at least two interviews to see your performance trend.</p>
        </div>
        )}
    </CardContent>
    </Card>
  );
}
