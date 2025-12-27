"use client";

import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PerformanceChartProps = {
  data: any[];
};

export default function PerformanceChart({ data }: PerformanceChartProps) {
  // ✅ SAFELY transform Firestore data
  const chartData =
    data
      ?.filter(
        (session) =>
          session?.createdAt &&
          typeof session.createdAt.toDate === "function" &&
          session?.feedback?.overallScore !== undefined
      )
      .map((session) => ({
        date: format(session.createdAt.toDate(), "MMM d"),
        score: session.feedback.overallScore,
      }))
      .reverse() || [];

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No interview data yet. Complete an interview to see your progress.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
