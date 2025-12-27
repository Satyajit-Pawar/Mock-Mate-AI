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
  answer: z.string().describe("The user's answer to the question."),
  interviewType: z.string().describe('The type of interview (Technical, Behavioral, Fresher).'),
});
export type ProvideInstantFeedbackInput = z.infer<typeof ProvideInstantFeedbackInputSchema>;

const ProvideInstantFeedbackOutputSchema = z.object({
  overallScore: z.number().min(0).max(10).describe('An overall score for the answer, on a scale of 0 to 10.'),
  strengths: z.array(z.string()).describe('A list of bullet points highlighting the strengths of the answer.'),
  areasForImprovement: z.array(z.string()).describe('A list of bullet points suggesting areas for improvement.'),
  summary: z.string().describe('A final, summarized paragraph of feedback.'),
});
export type ProvideInstantFeedbackOutput = z.infer<typeof ProvideInstantFeedbackOutputSchema>;

export async function provideInstantFeedback(input: ProvideInstantFeedbackInput): Promise<ProvideInstantFeedbackOutput> {
  return provideInstantFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideInstantFeedbackPrompt',
  input: {schema: ProvideInstantFeedbackInputSchema},
  output: {schema: ProvideInstantFeedbackOutputSchema},
  prompt: `You are an expert AI-powered interview coach providing instant, production-quality feedback.

  Analyze the user's answer based on the interview type and question. Provide structured, constructive feedback.

  Interview Type: {{{interviewType}}}
  Question: {{{question}}}
  Answer: {{{answer}}}

  Your evaluation must include:
  1.  **Overall Score**: A single score from 0 to 10, where 0 is poor and 10 is excellent.
  2.  **Strengths**: 2-3 specific, positive bullet points about what the user did well.
  3.  **Areas for Improvement**: 2-3 actionable bullet points on how to improve.
  4.  **Summary**: A concise paragraph summarizing the key feedback and providing encouragement.`,
  config: {
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
