"use client";

import { useState, useEffect, useRef } from 'react';
import { generateQuestion } from '@/ai/flows/dynamic-question-generation';
import { provideInstantFeedback } from '@/ai/flows/provide-instant-feedback';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Mic, StopCircle, Video } from 'lucide-react';
import type { InterviewType, InterviewFeedback } from '@/lib/types';
import FeedbackDialog from './feedback-dialog';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

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
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera and microphone permissions in your browser settings to use this feature.',
            });
          }
        };
    
        getCameraPermission();
      }, []);

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

    const startRecording = () => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                setAnswer(prev => prev + finalTranscript + interimTranscript.trimStart());
            };
            
            recognitionRef.current.start();
            setIsRecording(true);
        } else {
            toast({
                variant: 'destructive',
                title: 'Browser Not Supported',
                description: 'Your browser does not support speech recognition.',
            });
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSubmit = async () => {
        if (isRecording) {
            stopRecording();
        }

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
        setTimeout(() => {
            getNewQuestion();
        }, 300);
    };

    return (
        <>
            <Card className="w-full max-w-4xl shadow-2xl shadow-primary/10">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {interviewType} Interview
                    </CardTitle>
                    <CardDescription>Answer the question below to the best of your ability.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-6 border rounded-lg bg-muted/30 min-h-[120px] flex items-center justify-center shadow-inner">
                        {isLoading === 'question' ? (
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-5 w-3/4 mx-auto" />
                                <Skeleton className="h-5 w-1/2 mx-auto" />
                            </div>
                        ) : (
                            <p className="text-xl font-semibold text-center leading-relaxed">{question}</p>
                        )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
                            {hasCameraPermission === false && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 text-center">
                                    <Video className="h-10 w-10 text-muted-foreground mb-2" />
                                    <p className="font-semibold">Camera Access Denied</p>
                                    <p className="text-sm text-muted-foreground">Please allow camera and mic access in your browser to record.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                             <Textarea
                                placeholder={isRecording ? "Listening..." : "Your transcribed answer will appear here, or you can type directly."}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="flex-grow text-base"
                                rows={10}
                                disabled={isLoading !== false || isRecording}
                            />
                            <div className="flex items-center justify-center gap-4">
                                {!isRecording ? (
                                    <Button onClick={startRecording} disabled={isLoading !== false || hasCameraPermission !== true}>
                                        <Mic className="mr-2" /> Start Recording
                                    </Button>
                                ) : (
                                    <Button onClick={stopRecording} variant="destructive">
                                        <StopCircle className="mr-2" /> Stop Recording
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-end">
                    <Button onClick={handleSubmit} disabled={isLoading !== false || isRecording || !answer.trim()} size="lg">
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