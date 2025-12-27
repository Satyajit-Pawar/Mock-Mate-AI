"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { InterviewSession, InterviewType, InterviewDifficulty } from '@/lib/types';

import Header from '@/components/shared/header';
import InterviewTypeSelector from '@/components/dashboard/interview-type-selector';
import PerformanceChart from '@/components/dashboard/performance-chart';
import HistoryTable from '@/components/dashboard/history-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewType | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Medium');
  const [resumeText, setResumeText] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        setDataLoading(true);
        try {
          const q = query(
            collection(db, "interviews"), 
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InterviewSession[];
          
          // Sort data on the client-side
          historyData.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
            }
            return 0;
          });

          setHistory(historyData);
        } catch (error) {
          console.error("Error fetching interview history:", error);
        } finally {
          setDataLoading(false);
        }
      };
      fetchHistory();
    }
  }, [user]);

  const handleStartInterview = (type: InterviewType) => {
    setSelectedInterviewType(type);
    setSessionName('');
    setTopic('');
    setDifficulty('Medium');
    setResumeText('');
    setIsDialogVisible(true);
  };

  const handleConfirmStart = () => {
    if (selectedInterviewType) {
      const searchParams = new URLSearchParams();
      searchParams.set('sessionName', sessionName || `Practice - ${new Date().toLocaleDateString()}`);
      if (topic) {
        searchParams.set('topic', topic);
      }
      searchParams.set('difficulty', difficulty);
      if (resumeText) {
        searchParams.set('resumeText', resumeText);
      }

      router.push(`/interview/${selectedInterviewType.toLowerCase()}?${searchParams.toString()}`);
    }
    setIsDialogVisible(false);
  };


  if (loading || !user) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <main className="flex-grow container py-8">
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        </main>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container py-8">
          <div className="space-y-8">
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.displayName || 'Ace'}!</h1>
              
              <InterviewTypeSelector onSelect={handleStartInterview} />

              <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                <PerformanceChart data={history} />
                <HistoryTable data={history} loading={dataLoading} />
              </div>
          </div>
        </main>
      </div>
      <Dialog open={isDialogVisible} onOpenChange={setIsDialogVisible}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Start New Interview</DialogTitle>
            <DialogDescription>
              Configure your interview session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="session-name" className="text-right">
                Session Name
              </Label>
              <Input
                id="session-name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="col-span-3"
                placeholder={`e.g., "Google On-site Prep"`}
              />
            </div>
            {selectedInterviewType === 'Technical' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="topic" className="text-right">
                  Topic
                </Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="col-span-3"
                  placeholder={`e.g., "React Hooks"`}
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="text-right">
                    Difficulty
                </Label>
                 <Select value={difficulty} onValueChange={(value) => setDifficulty(value as InterviewDifficulty)}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="resume" className="text-right pt-2">
                    Resume (Optional)
                </Label>
                <Textarea
                    id="resume"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="col-span-3"
                    placeholder="Paste your resume text here to get questions based on your experience."
                    rows={6}
                />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleConfirmStart}>
              Start
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
