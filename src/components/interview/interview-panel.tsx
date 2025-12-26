"use client";

import { useState, useEffect } from 'react';
import { generateQuestion } from '@/ai/flows/dynamic-question-generation';
import { provideInstantFeedback } from '@/ai/flows/provide-instant-feedback';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import type { InterviewType, InterviewFeedback } from '@/lib/types';
import FeedbackDialog from './feedback-dialog';
import { toast } from '@/hooks/use-toast';

type InterviewPanelProps = {
    interviewType: InterviewType;
    userId: string;
};

export default function InterviewPanel({ interviewType, userId }: InterviewPanelProps) {
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
    const [isLoading, setIsLoading] = useState<'question' | 'feedback' | false>('question');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const getNewQuestion = async () => {
        setIsLoading('question');
        setQuestion('');
        setAnswer('');
        setFeedback(null);
        try {
            const result = await generateQuestion({ interviewType });
            setQuestion(result.question);
        } catch (error) {
            console.error("Failed to generate question", error);
            setQuestion("Sorry, I couldn't think of a question. Please try again.");
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to generate a new question.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewType]);

    const handleSubmit = async () => {
        if (!answer.trim()) {
            toast({
                variant: 'destructive',
                title: 'Empty Answer',
                description: 'Please provide an answer before submitting.',
            });
            return;
        }
        setIsLoading('feedback');
        try {
            const feedbackResult = await provideInstantFeedback({ question, answer, interviewType });
            setFeedback(feedbackResult);
            setIsDialogOpen(true);

            await addDoc(collection(db, "interviews"), {
                userId,
                interviewType,
                question,
                answer,
                feedback: feedbackResult,
                createdAt: serverTimestamp(),
            });

        } catch (error) {
            console.error("Failed to get feedback", error);
            toast({
                variant: 'destructive',
                title: 'Feedback Error',
                description: 'Could not get feedback for your answer.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        setIsDialogOpen(false);
        // A short delay for the dialog to close before loading new question
        setTimeout(() => {
            getNewQuestion();
        }, 300);
    };

    return (
        <>
            <Card className="w-full max-w-3xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        {interviewType} Mock Interview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-6 border rounded-lg bg-muted/40 min-h-[100px] flex items-center justify-center">
                        {isLoading === 'question' ? (
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-5 w-1/2" />
                            </div>
                        ) : (
                            <p className="text-lg font-medium text-center">{question}</p>
                        )}
                    </div>
                    <Textarea
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows={8}
                        disabled={isLoading !== false}
                    />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={isLoading !== false}>
                        {isLoading === 'feedback' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Answer
                    </Button>
                </CardFooter>
            </Card>
            {feedback && (
                <FeedbackDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    feedback={feedback}
                    onNext={handleNext}
                />
            )}
        </>
    );
}
