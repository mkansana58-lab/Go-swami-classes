"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generatePersonalizedStudyPlan } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  studentGoals: z.string().min(20, {
    message: "Goals must be at least 20 characters to provide enough context.",
  }),
  currentKnowledgeLevel: z.string({
    required_error: "Please select your knowledge level.",
  }),
  preferredLearningStyle: z.string().optional(),
});

export function StudyPlanForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentGoals: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await generatePersonalizedStudyPlan(values);
      if (result.studyPlan) {
        localStorage.setItem("studyPlan", result.studyPlan);
        router.push("/plan");
      } else {
        throw new Error("Failed to generate study plan. The result was empty.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Plan",
        description: "An unexpected error occurred. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="studentGoals"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Your Goals</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 'I want to clear the NDA exam in 6 months, focusing on Mathematics and General Ability.'"
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Be specific about what you want to achieve.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentKnowledgeLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Current Knowledge Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your knowledge level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (Just starting out)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (Have some basic knowledge)</SelectItem>
                  <SelectItem value="advanced">Advanced (Comfortable with most topics)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferredLearningStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Preferred Learning Style (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your learning style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="visual">Visual (diagrams, videos)</SelectItem>
                  <SelectItem value="auditory">Auditory (lectures, discussions)</SelectItem>
                  <SelectItem value="kinesthetic">Kinesthetic (hands-on practice)</SelectItem>
                  <SelectItem value="reading-writing">Reading/Writing (notes, articles)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full !mt-8 text-lg py-6" disabled={isLoading} variant="default">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Your Plan...
            </>
          ) : (
            "Generate My Plan"
          )}
        </Button>
      </form>
    </Form>
  );
}
