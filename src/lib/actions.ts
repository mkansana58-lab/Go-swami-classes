
"use server";

import { generatePersonalizedStudyPlan as generatePlan, type GeneratePersonalizedStudyPlanInput } from "@/ai/flows/generate-personalized-study-plan";
import { z } from "zod";
import { getModules, saveModule } from "./content-service";
import { revalidatePath } from "next/cache";

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

const moduleSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    topics: z.array(z.string().min(3, "Topic must be at least 3 characters")).min(1, "Module must have at least one topic"),
});

export async function createNewModule(prevState: any, formData: FormData) {
    const title = formData.get('title') as string;
    const topics = formData.getAll('topics').map(t => t.toString()).filter(t => t.trim() !== '');

    const validation = moduleSchema.safeParse({ title, topics });

    if (!validation.success) {
        return { success: false, error: validation.error.flatten().fieldErrors };
    }

    try {
        await saveModule({
            id: `admin-mod-${Date.now()}`,
            title: validation.data.title,
            topics: validation.data.topics,
        });
        revalidatePath('/api/content');
        revalidatePath('/admin/content');
        return { success: true, error: null };
    } catch (e) {
        const error = e as Error;
        return { success: false, error: { _form: [error.message] } };
    }
}

export async function getAdminModules() {
    return await getModules();
}
