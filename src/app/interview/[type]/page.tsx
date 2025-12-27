"use client";

import { useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/shared/header';
import InterviewPanel from '@/components/interview/interview-panel';
import type { InterviewType, InterviewDifficulty } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function InterviewPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const interviewTypeParam = Array.isArray(params.type) ? params.type[0] : params.type;
    const sessionName = searchParams.get('sessionName') || 'Practice Session';
    const topic = searchParams.get('topic');
    const difficulty = (searchParams.get('difficulty') as InterviewDifficulty) || 'Medium';
    const resumeText = searchParams.get('resumeText');

    // Capitalize first letter to match the InterviewType definition
    const interviewType = interviewTypeParam.charAt(0).toUpperCase() + interviewTypeParam.slice(1) as InterviewType;

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex-grow py-8 flex items-center justify-center">
                <div className="w-full max-w-3xl space-y-8">
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-10 w-32 ml-auto" />
                </div>
            </div>
          </div>
        );
    }

    const validTypes: InterviewType[] = ["Technical", "Behavioral", "Fresher"];
    if (!validTypes.includes(interviewType)) {
        return (
            <div className="flex flex-col h-screen">
                <Header />
                <div className="flex-grow py-8 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Invalid Interview Type</h1>
                        <p className="text-muted-foreground">Please select a valid interview type from the dashboard.</p>
                        <Button onClick={() => router.push('/dashboard')} className="mt-4">Go to Dashboard</Button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-screen bg-background">
            <Header />
            <main className="flex-grow py-8 flex items-center justify-center">
                <InterviewPanel 
                    interviewType={interviewType} 
                    userId={user.uid} 
                    sessionName={decodeURIComponent(sessionName)}
                    topic={topic ? decodeURIComponent(topic) : undefined}
                    difficulty={difficulty}
                    resumeText={resumeText ? decodeURIComponent(resumeText) : undefined}
                />
            </main>
        </div>
    );
}
