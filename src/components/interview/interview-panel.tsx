"use client";

import { useState, useEffect, useRef } from "react";
import { generateQuestion } from "@/ai/flows/dynamic-question-generation";
import { provideInstantFeedback } from "@/ai/flows/provide-instant-feedback";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from 'next/navigation';


import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Mic, StopCircle, Video, LogOut } from "lucide-react";
import type { InterviewType, InterviewFeedback, InterviewDifficulty } from "@/lib/types";
import FeedbackDialog from "./feedback-dialog";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

/* ✅ FIX SpeechRecognition typing */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type InterviewPanelProps = {
  interviewType: InterviewType;
  userId: string;
  sessionName: string;
  topic?: string;
  difficulty?: InterviewDifficulty;
  resumeText?: string;
};

export default function InterviewPanel({
  interviewType,
  userId,
  sessionName,
  topic,
  difficulty,
  resumeText,
}: InterviewPanelProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isLoading, setIsLoading] =
    useState<"question" | "feedback" | false>("question");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] =
    useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();


  /* ✅ Camera permission (SSR safe) */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description:
            "Please allow camera and microphone permissions in your browser.",
        });
      }
    };

    getCameraPermission();
  }, []);

  /* ✅ Generate question */
  const getNewQuestion = async () => {
    setIsLoading("question");
    setQuestion("");
    setAnswer("");
    setFeedback(null);

    try {
      const result = await generateQuestion({ interviewType, topic, difficulty, resumeText });
      setQuestion(result.question);
    } catch {
      setQuestion("Failed to generate question. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Question generation failed.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewType, topic, difficulty, resumeText]);

  /* ✅ Start recording */
  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Browser Not Supported",
        description: "Speech recognition is not supported.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer((prev) => (prev + " " + transcript).trim());
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  /* ✅ Submit answer */
  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Answer",
        description: "Please provide an answer.",
      });
      return;
    }

    if (isRecording) stopRecording();
    setIsLoading("feedback");

    try {
      const feedbackResult = await provideInstantFeedback({
        question,
        answer,
        interviewType,
      });

      setFeedback(feedbackResult);
      setIsDialogOpen(true);

      await addDoc(collection(db, "interviews"), {
        userId,
        interviewType,
        sessionName,
        topic: topic || null,
        difficulty: difficulty || null,
        question,
        answer,
        feedback: feedbackResult,
        createdAt: serverTimestamp(),
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Feedback Error",
        description: "Could not evaluate answer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setIsDialogOpen(false);
    setTimeout(getNewQuestion, 300);
  };

  const handleEndInterview = () => {
    router.push('/dashboard');
  }

  return (
    <>
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader className="text-center relative">
          <CardTitle className="text-2xl">{sessionName}</CardTitle>
          <CardDescription>
            {interviewType} Interview - Answer the question below to the best of your ability.
          </CardDescription>
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute top-4 right-4"
            onClick={handleEndInterview}
          >
            <LogOut className="mr-2 h-4 w-4" />
            End Interview
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-6 border rounded-lg min-h-[120px] flex items-center justify-center">
            {isLoading === "question" ? (
              <Skeleton className="h-6 w-3/4" />
            ) : (
              <p className="text-xl font-semibold text-center">{question}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                  <Video className="h-10 w-10 mb-2" />
                  <p>Camera Access Denied</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Textarea
                rows={10}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={isRecording ? "Listening..." : "Type your answer"}
                disabled={isLoading !== false}
              />

              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    disabled={hasCameraPermission !== true}
                  >
                    <Mic className="mr-2" /> Start Recording
                  </Button>
                ) : (
                  <Button variant="destructive" onClick={stopRecording}>
                    <StopCircle className="mr-2" /> Stop Recording
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-6 flex justify-end">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isLoading !== false || !answer.trim()}
          >
            {isLoading === "feedback" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
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
          onEnd={handleEndInterview}
        />
      )}
    </>
  );
}
