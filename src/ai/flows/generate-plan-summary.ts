'use server';

/**
 * @fileOverview A flow to generate a summary of the personalized walking plan.
 *
 * - generatePlanSummary - A function that generates the plan summary.
 * - GeneratePlanSummaryInput - The input type for the generatePlanSummary function.
 * - GeneratePlanSummaryOutput - The return type for the generatePlanSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlanSummaryInputSchema = z.object({
  gender: z.string().describe('The user\'s gender (Mujer/Hombre).'),
  ageRange: z.string().describe('The user\'s age range.'),
  heightCm: z.number().describe('The user\'s height in centimeters.'),
  weightKg: z.number().describe('The user\'s current weight in kilograms.'),
  weightGoal: z
    .string() // Can be a number or a description like "lose 5kg"
    .describe('The user\'s weight goal.'),
  bodyType: z.string().describe('The user\'s body type (visual selection).'),
  activityLevel: z
    .string()
    .describe(
      'The user\'s activity level (sedentary, active, very active) and daily routine description.'
    ),
  walkingExperience: z
    .string()
    .describe(
      'The user\'s experience with walking for exercise and commitment to walking days per week.'
    ),
  motivationObstacle: z
    .string()
    .describe(
      'The user\'s primary motivation to move and biggest obstacle preventing them from doing so.'
    ),
  healthConditions: z
    .string()
    .describe(
      'Any medical conditions, allergies, or special diets the user follows (diabetes, vegan, none, etc.).'
    ),
  waterSleep: z
    .string()
    .describe(
      'The user\'s daily water intake and sleep quality (options for quick selection).'
    ),
  walkingBelief: z
    .string()
    .describe(
      'The user\'s belief about whether walking can help them lose weight and feel better (yes/no/not sure).'
    ),
});
export type GeneratePlanSummaryInput = z.infer<typeof GeneratePlanSummaryInputSchema>;

const GeneratePlanSummaryOutputSchema = z.object({
  planSummary: z.string().describe('A summary of the generated plan.'),
});
export type GeneratePlanSummaryOutput = z.infer<typeof GeneratePlanSummaryOutputSchema>;

export async function generatePlanSummary(input: GeneratePlanSummaryInput): Promise<GeneratePlanSummaryOutput> {
  return generatePlanSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlanSummaryPrompt',
  input: {schema: GeneratePlanSummaryInputSchema},
  output: {schema: GeneratePlanSummaryOutputSchema},
  prompt: `Based on the user's quiz answers, create a summary of their personalized 3-month walking plan.

  Here are the quiz answers:
  Gender: {{{gender}}}
  Age Range: {{{ageRange}}}
  Height (cm): {{{heightCm}}}
  Weight (kg): {{{weightKg}}}
  Weight Goal: {{{weightGoal}}}
  Body Type: {{{bodyType}}}
  Activity Level: {{{activityLevel}}}
  Walking Experience: {{{walkingExperience}}}
  Motivation/Obstacle: {{{motivationObstacle}}}
  Health Conditions: {{{healthConditions}}}
  Water/Sleep: {{{waterSleep}}}
  Walking Belief: {{{walkingBelief}}}

  The summary should include:
  - An estimate of the weekly walking time commitment.
  - An estimated weight loss over 3 months.
  - A motivational message encouraging them to follow the plan.
  - The summary must be in Spanish.
  `,
});

const generatePlanSummaryFlow = ai.defineFlow(
  {
    name: 'generatePlanSummaryFlow',
    inputSchema: GeneratePlanSummaryInputSchema,
    outputSchema: GeneratePlanSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
