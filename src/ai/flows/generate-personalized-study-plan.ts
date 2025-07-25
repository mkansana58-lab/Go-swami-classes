'use server';

/**
 * @fileOverview A personalized study plan generator AI agent.
 *
 * - generatePersonalizedStudyPlan - A function that handles the study plan generation process.
 * - GeneratePersonalizedStudyPlanInput - The input type for the generatePersonalizedStudyPlan function.
 * - GeneratePersonalizedStudyPlanOutput - The return type for the generatePersonalizedStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedStudyPlanInputSchema = z.object({
  studentGoals: z
    .string()
    .describe('The specific goals of the student.'),
  currentKnowledgeLevel: z
    .string()
    .describe('The current knowledge level of the student.'),
  preferredLearningStyle: z
    .string()
    .optional()
    .describe('The preferred learning style of the student, e.g., visual, auditory, kinesthetic.'),
});
export type GeneratePersonalizedStudyPlanInput = z.infer<
  typeof GeneratePersonalizedStudyPlanInputSchema
>;

const GeneratePersonalizedStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('The generated personalized study plan.'),
});
export type GeneratePersonalizedStudyPlanOutput = z.infer<
  typeof GeneratePersonalizedStudyPlanOutputSchema
>;

export async function generatePersonalizedStudyPlan(
  input: GeneratePersonalizedStudyPlanInput
): Promise<GeneratePersonalizedStudyPlanOutput> {
  return generatePersonalizedStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedStudyPlanPrompt',
  input: {schema: GeneratePersonalizedStudyPlanInputSchema},
  output: {schema: GeneratePersonalizedStudyPlanOutputSchema},
  prompt: `You are an expert learning plan generator.

You will generate a personalized study plan based on the student's goals, current knowledge level, and preferred learning style.

Student Goals: {{{studentGoals}}}
Current Knowledge Level: {{{currentKnowledgeLevel}}}
Preferred Learning Style: {{{preferredLearningStyle}}}

Study Plan:`,
});

const generatePersonalizedStudyPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedStudyPlanFlow',
    inputSchema: GeneratePersonalizedStudyPlanInputSchema,
    outputSchema: GeneratePersonalizedStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
