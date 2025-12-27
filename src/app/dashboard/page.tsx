"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import type { InterviewSession, InterviewType } from '@/lib/types';

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

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewType | null>(null);
  const [sessionName, setSessionName] = useState('');

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
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
          );
          const querySnapshot = await getDocs(q);
          const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InterviewSession[];
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
    setIsDialogVisible(true);
  };

  const handleConfirmStart = () => {
    if (selectedInterviewType) {
      const encodedSessionName = encodeURIComponent(sessionName || `Practice - ${new Date().toLocaleDateString()}`);
      router.push(`/interview/${selectedInterviewType.toLowerCase()}?sessionName=${encodedSessionName}`);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Interview</DialogTitle>
            <DialogDescription>
              Give this interview session a name to track your progress.
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
