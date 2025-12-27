'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating dynamic interview questions.
 *
 * The flow takes an interview type as input and generates a relevant interview question.
 * - generateQuestion - A function that generates a dynamic interview question based on the provided interview type.
 * - GenerateQuestionInput - The input type for the generateQuestion function.
 * - GenerateQuestionOutput - The output type for the generateQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionInputSchema = z.object({
  interviewType: z
    .string()
    .describe(
      'The type of interview for which to generate a question (e.g., Technical, Behavioral, Fresher).'
    ),
  topic: z.string().optional().describe('A specific topic for the interview question (e.g., "React Hooks", "AWS S3").'),
  difficulty: z.string().optional().describe('The difficulty level of the question (e.g., "Easy", "Medium", "Hard").'),
  resumeText: z.string().optional().describe('The text content of the user\'s resume.'),
});
export type GenerateQuestionInput = z.infer<typeof GenerateQuestionInputSchema>;

const GenerateQuestionOutputSchema = z.object({
  question: z.string().describe('The generated interview question.'),
});
export type GenerateQuestionOutput = z.infer<typeof GenerateQuestionOutputSchema>;

export async function generateQuestion(
  input: GenerateQuestionInput
): Promise<GenerateQuestionOutput> {
  return generateQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestionPrompt',
  input: {schema: GenerateQuestionInputSchema},
  output: {schema: GenerateQuestionOutputSchema},
  prompt: `You are an experienced interviewer. Generate a dynamic and relevant interview question for a {{interviewType}} interview.
  {{#if topic}}
  The question should be about the following topic: {{topic}}.
  {{/if}}
  {{#if difficulty}}
  The question should be of {{difficulty}} difficulty.
  {{/if}}
  {{#if resumeText}}
  Base the question on the candidate's experience and skills as detailed in their resume below.
  ---
  Resume:
  {{{resumeText}}}
  ---
  {{/if}}
  The question should be challenging and insightful, designed to assess the candidate's skills and experience. Focus on open-ended questions that require the candidate to elaborate. The answer should be 1-3 sentences.`,
});

const generateQuestionFlow = ai.defineFlow(
  {
    name: 'generateQuestionFlow',
    inputSchema: GenerateQuestionInputSchema,
    outputSchema: GenerateQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
