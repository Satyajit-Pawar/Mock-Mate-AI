'use server';

/**
 * @fileOverview A flow for providing instant feedback on mock interview responses.
 *
 * - provideInstantFeedback - A function that provides instant feedback on mock interview responses.
 * - ProvideInstantFeedbackInput - The input type for the provideInstantFeedback function.
 * - ProvideInstantFeedbackOutput - The return type for the provideInstantFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideInstantFeedbackInputSchema = z.object({
  question: z.string().describe('The interview question that was asked.'),
  answer: z.string().describe('The user\'s answer to the question.'),
  interviewType: z.string().describe('The type of interview (Technical, HR, Behavioral, Fresher).'),
});
export type ProvideInstantFeedbackInput = z.infer<typeof ProvideInstantFeedbackInputSchema>;

const ProvideInstantFeedbackOutputSchema = z.object({
  strengths: z.string().describe('Strengths of the answer.'),
  weaknesses: z.string().describe('Weaknesses of the answer.'),
  suggestions: z.string().describe('Specific suggestions for improvement.'),
  overallScore: z.number().describe('An overall score for the answer (0-100).'),
});
export type ProvideInstantFeedbackOutput = z.infer<typeof ProvideInstantFeedbackOutputSchema>;

export async function provideInstantFeedback(input: ProvideInstantFeedbackInput): Promise<ProvideInstantFeedbackOutput> {
  return provideInstantFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideInstantFeedbackPrompt',
  input: {schema: ProvideInstantFeedbackInputSchema},
  output: {schema: ProvideInstantFeedbackOutputSchema},
  prompt: `You are an AI-powered interview coach providing instant feedback to students.

You will receive the interview question, the student\'s answer, and the interview type.

Your task is to analyze the answer and provide structured feedback, including strengths, weaknesses, and specific suggestions for improvement.

Also, provide an overall score for the answer (0-100).

Interview Type: {{{interviewType}}}
Question: {{{question}}}
Answer: {{{answer}}}

Strengths:

Weaknesses:

Suggestions:

Overall Score:`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const provideInstantFeedbackFlow = ai.defineFlow(
  {
    name: 'provideInstantFeedbackFlow',
    inputSchema: ProvideInstantFeedbackInputSchema,
    outputSchema: ProvideInstantFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
