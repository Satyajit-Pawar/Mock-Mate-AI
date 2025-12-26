"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
    <section>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Your Performance</h2>
      <Card>
        <CardHeader>
          <CardTitle>Overall Score Trend</CardTitle>
          <CardDescription>Your average scores over your last interview sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
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
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                 />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="score" fill="var(--color-score)" radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[250px] text-center bg-muted/50 rounded-lg">
                <p className="font-semibold">No interview data yet.</p>
                <p className="text-sm text-muted-foreground">Complete an interview to see your performance chart.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
