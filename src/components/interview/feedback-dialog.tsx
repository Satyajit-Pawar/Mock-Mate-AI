"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, Lightbulb, ArrowRight } from "lucide-react";
import type { InterviewFeedback } from "@/lib/types";

type FeedbackDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: InterviewFeedback;
  onNext: () => void;
};

export default function FeedbackDialog({ open, onOpenChange, feedback, onNext }: FeedbackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your Feedback</DialogTitle>
          <DialogDescription>Here's an analysis of your response.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Overall Score</h3>
                <span className="font-bold text-lg text-primary">{feedback.overallScore}/100</span>
            </div>
            <Progress value={feedback.overallScore} className="w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <h4 className="flex items-center font-semibold text-green-600 dark:text-green-500">
                    <ThumbsUp className="mr-2 h-5 w-5" /> Strengths
                </h4>
                <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-md min-h-[100px]">{feedback.strengths}</div>
            </div>
            <div className="space-y-2">
                <h4 className="flex items-center font-semibold text-red-600 dark:text-red-500">
                    <ThumbsDown className="mr-2 h-5 w-5" /> Weaknesses
                </h4>
                <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-md min-h-[100px]">{feedback.weaknesses}</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="flex items-center font-semibold text-blue-600 dark:text-blue-500">
                <Lightbulb className="mr-2 h-5 w-5" /> Suggestions for Improvement
            </h4>
            <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-md">{feedback.suggestions}</div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onNext} className="w-full sm:w-auto">
            Next Question <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
