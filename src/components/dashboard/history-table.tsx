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
import { ScrollArea } from "@/components/ui/scroll-area";

type HistoryTableProps = {
  data: InterviewSession[];
  loading: boolean;
};

export default function HistoryTable({ data, loading }: HistoryTableProps) {
  // Filter for sessions that have a valid 'createdAt' property.
  const validData = data.filter(session => session.createdAt);
  
  return (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Interview History</CardTitle>
            <CardDescription>A log of your most recent mock interviews.</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[300px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Session</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                              <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                            </TableRow>
                          ))
                        ) : validData.length > 0 ? (
                            validData.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell className="font-semibold">{session.sessionName || 'Practice Session'}</TableCell>
                                    <TableCell><Badge variant="outline" className="font-normal">{session.interviewType}</Badge></TableCell>
                                    <TableCell>{format(session.createdAt.toDate(), "MMM d, yyyy")}</TableCell>
                                    <TableCell className="text-right font-semibold text-primary">{session.feedback.overallScore}/10</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    You haven't completed any interviews yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
        </CardContent>
    </Card>
  );
}
