"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { createNewModule } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef, useState } from 'react';
import { PlusCircle, Loader2, XCircle } from 'lucide-react';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="animate-spin mr-2" /> Creating...</> : 'Create Module'}
    </Button>
  );
}

export function CreateContentForm() {
  const [state, formAction] = useFormState(createNewModule, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [topics, setTopics] = useState<string[]>(['']);

  useEffect(() => {
    if (state?.success) {
      toast({ title: 'Success', description: 'New module created.' });
      formRef.current?.reset();
      setTopics(['']);
    } else if (state?.error) {
      const errorMessages = Object.values(state.error).flat().join(' ');
      toast({ variant: 'destructive', title: 'Error', description: errorMessages });
    }
  }, [state, toast]);
  
  const handleAddTopic = () => {
    setTopics([...topics, '']);
  }

  const handleRemoveTopic = (index: number) => {
    if (topics.length > 1) {
        setTopics(topics.filter((_, i) => i !== index));
    }
  }
  
  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Module Title</Label>
        <Input id="title" name="title" placeholder="e.g., Indian History" required />
        {state?.error?.title && <p className="text-destructive text-sm">{state.error.title}</p>}
      </div>
      <div className="space-y-2">
        <Label>Topics</Label>
        {topics.map((topic, index) => (
            <div key={index} className="flex items-center gap-2">
                <Input
                    name="topics"
                    placeholder={`Topic ${index + 1}`}
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTopic(index)} disabled={topics.length <= 1}>
                    <XCircle className="h-4 w-4"/>
                </Button>
            </div>
        ))}

        <Button type="button" variant="outline" size="sm" onClick={handleAddTopic}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Topic
        </Button>
        {state?.error?.topics && <p className="text-destructive text-sm">{state.error.topics}</p>}
      </div>
      <SubmitButton />
      {state?.error?._form && <p className="text-destructive text-sm mt-2">{state.error._form}</p>}
    </form>
  );
}
