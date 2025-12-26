"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { InterviewSession } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type HistoryTableProps = {
  data: InterviewSession[];
  loading: boolean;
};

export default function HistoryTable({ data, loading }: HistoryTableProps) {
  return (
    <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Interview History</h2>
        <Card>
            <CardHeader>
                <CardTitle>Past Sessions</CardTitle>
                <CardDescription>A log of all your completed mock interviews.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="hidden md:table-cell">Question</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                              <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-full" /></TableCell>
                              <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                            </TableRow>
                          ))
                        ) : data.length > 0 ? (
                            data.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell className="font-medium">{format(session.createdAt.toDate(), "MMM d, yyyy")}</TableCell>
                                    <TableCell><Badge variant="secondary">{session.interviewType}</Badge></TableCell>
                                    <TableCell className="hidden md:table-cell max-w-sm truncate text-muted-foreground">{session.question}</TableCell>
                                    <TableCell className="text-right font-semibold text-primary">{session.feedback.overallScore}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No interview history found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </section>
  );
}
