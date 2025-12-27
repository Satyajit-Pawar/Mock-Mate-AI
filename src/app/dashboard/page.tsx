"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import type { InterviewSession } from '@/lib/types';

import Header from '@/components/shared/header';
import InterviewTypeSelector from '@/components/dashboard/interview-type-selector';
import PerformanceChart from '@/components/dashboard/performance-chart';
import HistoryTable from '@/components/dashboard/history-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container py-8">
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.displayName || 'Ace'}!</h1>
            
            <InterviewTypeSelector />

            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
              <PerformanceChart data={history} />
              <HistoryTable data={history} loading={dataLoading} />
            </div>
        </div>
      </main>
    </div>
  );
}
