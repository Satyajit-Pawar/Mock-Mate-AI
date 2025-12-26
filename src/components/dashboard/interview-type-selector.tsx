"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Users, MessageSquare, Briefcase } from 'lucide-react';
import type { InterviewType } from '@/lib/types';

const interviewTypes: { type: InterviewType; title: string; description: string; icon: React.ReactNode }[] = [
  { type: 'Technical', title: 'Technical', description: 'Assess your coding and problem-solving skills.', icon: <Cpu className="h-10 w-10 text-primary" /> },
  { type: 'HR', title: 'HR Round', description: 'Evaluate your personality and cultural fit.', icon: <Users className="h-10 w-10 text-primary" /> },
  { type: 'Behavioral', title: 'Behavioral', description: 'Demonstrate how you handle work situations.', icon: <MessageSquare className="h-10 w-10 text-primary" /> },
  { type: 'Fresher', title: 'Fresher', description: 'General questions for entry-level candidates.', icon: <Briefcase className="h-10 w-10 text-primary" /> },
];

export default function InterviewTypeSelector() {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Start a New Mock Interview</h2>
      <p className="text-muted-foreground mb-6">Select an interview type to begin your practice session.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {interviewTypes.map((it) => (
          <Card key={it.type} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="items-center">
              <div className="bg-primary/10 p-4 rounded-full">{it.icon}</div>
            </CardHeader>
            <CardContent className="flex-grow text-center">
              <CardTitle className="text-xl">{it.title}</CardTitle>
              <CardDescription className="mt-2">{it.description}</CardDescription>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/interview/${it.type.toLowerCase()}`}>Start Now</Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
