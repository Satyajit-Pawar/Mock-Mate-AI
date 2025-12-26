import { config } from 'dotenv';
config();

import '@/ai/flows/dynamic-question-generation.ts';
import '@/ai/flows/analyze-user-responses.ts';
import '@/ai/flows/provide-instant-feedback.ts';