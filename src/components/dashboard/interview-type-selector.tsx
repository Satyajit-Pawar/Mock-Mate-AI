"use client";

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Users, MessageSquare, Briefcase, ArrowRight } from 'lucide-react';
import type { InterviewType } from '@/lib/types';

const interviewTypes: { type: InterviewType; title: string; description: string; icon: React.ReactNode }[] = [
  { type: 'Technical', title: 'Technical', description: 'Assess your coding and problem-solving skills.', icon: <Cpu className="h-8 w-8" /> },
  { type: 'HR', title: 'HR Round', description: 'Evaluate your personality and cultural fit.', icon: <Users className="h-8 w-8" /> },
  { type: 'Behavioral', title: 'Behavioral', description: 'Demonstrate how you handle work situations.', icon: <MessageSquare className="h-8 w-8" /> },
  { type: 'Fresher', title: 'Fresher', description: 'General questions for entry-level candidates.', icon: <Briefcase className="h-8 w-8" /> },
];

export default function InterviewTypeSelector() {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Start a New Interview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {interviewTypes.map((it) => (
            <Card key={it.type} className="group relative overflow-hidden flex flex-col justify-between hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg w-min">{it.icon}</div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold">{it.title}</h3>
                        <p className="text-muted-foreground text-sm">{it.description}</p>
                    </div>
                </CardContent>
                <div className="px-6 pb-6">
                    <Button asChild variant="secondary" className="w-full justify-start">
                        <Link href={`/interview/${it.type.toLowerCase()}`}>
                            Start Session <ArrowRight className="ml-auto group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </Card>
        ))}
      </div>
    </section>
  );
}
