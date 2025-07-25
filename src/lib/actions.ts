
"use server";

import { generatePersonalizedStudyPlan as generatePlan, type GeneratePersonalizedStudyPlanInput } from "@/ai/flows/generate-personalized-study-plan";
import { z } from "zod";

const formSchema = z.object({
  studentGoals: z.string().min(10),
  currentKnowledgeLevel: z.string(),
  preferredLearningStyle: z.string().optional(),
});

export async function generatePersonalizedStudyPlan(values: GeneratePersonalizedStudyPlanInput) {
    const parsedValues = formSchema.safeParse(values);

    if (!parsedValues.success) {
        throw new Error("Invalid input");
    }

    // This calls the actual GenAI flow
    return await generatePlan(parsedValues.data);
}
