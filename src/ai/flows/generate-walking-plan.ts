'use server';

/**
 * @fileOverview Generates a personalized 3-month walking plan based on user quiz responses.
 *
 * - generateWalkingPlan - A function that generates the walking plan.
 * - GenerateWalkingPlanInput - The input type for the generateWalkingPlan function.
 * - GenerateWalkingPlanOutput - The return type for the generateWalkingPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWalkingPlanInputSchema = z.object({
  gender: z.enum(['Mujer', 'Hombre']).describe('The user\'s gender.'),
  ageRange: z.string().describe('The user\'s age range.'),
  heightCm: z.number().describe('The user\'s height in centimeters.'),
  weightKg: z.number().describe('The user\'s current weight in kilograms.'),
  weightGoal: z.string().describe('The user\'s weight loss goal.'),
  bodyType: z.string().describe('The user\'s identified body type (illustration from Slimkit).'),
  activityLevel: z.enum(['sedentario', 'activo', 'muy activo']).describe('The user\'s activity level.'),
  dailyRoutine: z.string().describe('Brief description of the user\'s daily routine.'),
  walkingExperience: z.string().describe('The user\'s experience with walking for exercise.'),
  commitmentDays: z.number().describe('The number of days per week the user can commit to walking.'),
  motivation: z.string().describe('The user\'s primary motivation for walking.'),
  biggestObstacle: z.string().describe('The user\'s biggest obstacle to walking.'),
  medicalConditions: z.array(z.string()).describe('Any medical conditions, allergies, or special diets the user follows.'),
  waterIntake: z.string().describe('The user\'s daily water intake.'),
  sleepQuality: z.string().describe('The user\'s sleep quality.'),
  beliefInWalking: z.enum(['sí', 'no', 'no sé']).describe('The user\'s belief in the effectiveness of walking for weight loss.'),
});
export type GenerateWalkingPlanInput = z.infer<typeof GenerateWalkingPlanInputSchema>;

const GenerateWalkingPlanOutputSchema = z.object({
  walkingPlan: z.string().describe('A personalized 3-month walking plan for the user.'),
  nutritionTips: z.string().describe('Nutrition tips to complement the walking plan.'),
  motivationalMessage: z.string().describe('A motivational message to encourage the user.'),
});
export type GenerateWalkingPlanOutput = z.infer<typeof GenerateWalkingPlanOutputSchema>;

export async function generateWalkingPlan(input: GenerateWalkingPlanInput): Promise<GenerateWalkingPlanOutput> {
  return generateWalkingPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWalkingPlanPrompt',
  input: {schema: GenerateWalkingPlanInputSchema},
  output: {schema: GenerateWalkingPlanOutputSchema},
  prompt: `You are a personal fitness and nutrition expert specializing in creating walking plans for Latin American women.

Based on the user's quiz responses, create a personalized 3-month walking plan. Consider their gender, age, height, weight, goals, activity level, and any health conditions.
Provide specific walking schedules, intensity levels, and duration, as well as nutrition tips to maximize weight loss results.
Also, give a motivational message to keep them committed to the plan. Speak in a warm and encouraging tone, using language appropriate for a Latin American audience, similar to Slimkit.

Here are the user's quiz responses:

Gender: {{{gender}}}
Age Range: {{{ageRange}}}
Height (cm): {{{heightCm}}}
Weight (kg): {{{weightKg}}}
Weight Goal: {{{weightGoal}}}
Body Type: {{{bodyType}}}
Activity Level: {{{activityLevel}}}
Daily Routine: {{{dailyRoutine}}}
Walking Experience: {{{walkingExperience}}}
Commitment (Days/Week): {{{commitmentDays}}}
Motivation: {{{motivation}}}
Biggest Obstacle: {{{biggestObstacle}}}
Medical Conditions: {{{medicalConditions}}}
Water Intake: {{{waterIntake}}}
Sleep Quality: {{{sleepQuality}}}
Belief in Walking: {{{beliefInWalking}}}

Now, create the walking plan, nutrition tips, and motivational message. Be as detailed as possible, providing a plan for each week.
Remember to use metric units and Latin American Spanish.
`,
});

const generateWalkingPlanFlow = ai.defineFlow(
  {
    name: 'generateWalkingPlanFlow',
    inputSchema: GenerateWalkingPlanInputSchema,
    outputSchema: GenerateWalkingPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
