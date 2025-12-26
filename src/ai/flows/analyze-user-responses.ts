'use server';

/**
 * @fileOverview A flow for analyzing user responses during mock interviews.
 *
 * - analyzeUserResponse - A function that analyzes the user's response and provides feedback.
 * - AnalyzeUserResponseInput - The input type for the analyzeUserResponse function.
 * - AnalyzeUserResponseOutput - The return type for the analyzeUserResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserResponseInputSchema = z.object({
  question: z.string().describe('The interview question asked.'),
  response: z.string().describe('The user\'s response to the question.'),
  interviewType: z
    .string()
    .describe(
      'The type of interview (Technical, HR, Behavioral, Fresher). This affects the evaluation criteria.'
    ),
});
export type AnalyzeUserResponseInput = z.infer<typeof AnalyzeUserResponseInputSchema>;

const AnalyzeUserResponseOutputSchema = z.object({
  clarity: z
    .string()
    .describe(
      'Feedback on the clarity of the response.  Suggestions for how the user could have been more clear and concise in their response.'
    ),
  relevance: z
    .string()
    .describe(
      'Feedback on the relevance of the response to the question asked. Suggestion for how the user could have better tailored their response to the question.'
    ),
  confidence: z
    .string()
    .describe(
      'Feedback on the confidence expressed in the response. Suggestions for how the user could improve confidence in their responses.'
    ),
  overallFeedback: z.string().describe('An overall assessment of the response.'),
  strengths: z.string().describe('Key strengths demonstrated in the response.'),
  weaknesses: z.string().describe('Areas where the response could be improved.'),
  improvementSuggestions: z
    .string()
    .describe('Specific suggestions for improving future responses.'),
});
export type AnalyzeUserResponseOutput = z.infer<typeof AnalyzeUserResponseOutputSchema>;

export async function analyzeUserResponse(
  input: AnalyzeUserResponseInput
): Promise<AnalyzeUserResponseOutput> {
  return analyzeUserResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserResponsePrompt',
  input: {schema: AnalyzeUserResponseInputSchema},
  output: {schema: AnalyzeUserResponseOutputSchema},
  prompt: `You are an AI-powered interview coach, providing detailed feedback on user responses during mock interviews.

  Evaluate the response based on the following criteria, tailored to the interview type ({{{interviewType}}}):
  - Clarity: How clear and easy to understand was the response?
  - Relevance: How relevant was the response to the question asked?
  - Confidence: How confident did the user sound in their response?

  Question: {{{question}}}
  Response: {{{response}}}

  Provide feedback in a structured format, including:
  - Clarity: [Your assessment of the clarity of the response]
  - Relevance: [Your assessment of the relevance of the response]
  - Confidence: [Your assessment of the confidence expressed in the response]
  - Overall Feedback: [Your overall assessment of the response]
  - Strengths: [Key strengths demonstrated in the response]
  - Weaknesses: [Areas where the response could be improved]
  - Improvement Suggestions: [Specific, actionable suggestions for improving future responses]`,
});

const analyzeUserResponseFlow = ai.defineFlow(
  {
    name: 'analyzeUserResponseFlow',
    inputSchema: AnalyzeUserResponseInputSchema,
    outputSchema: AnalyzeUserResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
