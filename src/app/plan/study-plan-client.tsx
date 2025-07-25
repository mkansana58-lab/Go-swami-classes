"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookCheck, BrainCircuit, Rocket, Trophy, Loader2, PartyPopper } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Topic {
  id: string;
  text: string;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

interface StudyPlan {
  title: string;
  modules: Module[];
}

const parsePlan = (planText: string): StudyPlan => {
    const lines = planText.split('\n').filter(line => line.trim() !== '');
    const titleLine = lines.find(line => line.startsWith('# '));
    const title = titleLine ? titleLine.replace('# ', '').trim() : 'Your Personalized Study Plan';
    
    const modules: Module[] = [];
    let currentModule: Module | null = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('## ')) {
            if (currentModule) modules.push(currentModule);
            const moduleTitle = trimmedLine.replace('## ', '').trim();
            currentModule = { id: `mod-${modules.length}`, title: moduleTitle, topics: [] };
        } else if ((trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) && currentModule) {
            const topicText = trimmedLine.substring(2).trim();
            currentModule.topics.push({ id: `topic-${currentModule.id}-${currentModule.topics.length}`, text: topicText, completed: false });
        }
    }
    if (currentModule) modules.push(currentModule);

    return { title, modules };
};

const QuizComponent = ({ moduleTitle }: { moduleTitle: string }) => {
  const [quizState, setQuizState] = useState<'not_started' | 'in_progress' | 'finished'>('in_progress');
  const [questions] = useState([
    { question: `What is a key principle of leadership in defence? (Mock for ${moduleTitle})`, answers: ['Leading by example', 'Micromanagement', 'Avoiding decisions', 'Prioritizing comfort'], correct: 'Leading by example' },
    { question: 'What does NDA stand for?', answers: ['National Defence Academy', 'Naval Defence Agency', 'National Drone Association', 'Nuclear Deployment Area'], correct: 'National Defence Academy' }
  ].sort(() => Math.random() - 0.5));

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    if (answer === questions[currentQuestion].correct) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(q => q + 1);
      } else {
        setQuizState('finished');
      }
    }, 1500);
  };
  
  if (quizState === 'finished') {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Quiz Complete!</DialogTitle>
          <DialogDescription>You've completed the quiz for {moduleTitle}.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <Trophy className="w-16 h-16 text-accent mb-4"/>
            <p className="text-2xl font-bold">Your Score: {score}/{questions.length}</p>
            <p className="text-muted-foreground mt-2">{score > (questions.length / 2) ? "Great job!" : "Keep practicing!"}</p>
        </div>
        <DialogFooter>
            <Button onClick={() => setQuizState('in_progress')}>Close</Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Quiz: {moduleTitle}</DialogTitle>
        <DialogDescription>Question {currentQuestion + 1} of {questions.length}</DialogDescription>
      </DialogHeader>
      <div>
        <h3 className="text-lg font-semibold mb-4 min-h-[60px]">{questions[currentQuestion].question}</h3>
        <div className="grid grid-cols-1 gap-2">
          {questions[currentQuestion].answers.map(answer => (
            <Button
              key={answer}
              variant={showFeedback && selectedAnswer === answer ? 'default' : 'outline'}
              onClick={() => handleAnswer(answer)}
              disabled={showFeedback}
              className={`justify-start transition-all duration-300 h-auto py-3 whitespace-normal
                ${showFeedback && selectedAnswer === answer && answer === questions[currentQuestion].correct ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                ${showFeedback && selectedAnswer === answer && answer !== questions[currentQuestion].correct ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}
              `}
            >
              {answer}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};


export function StudyPlanClient() {
    const [plan, setPlan] = useState<StudyPlan | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const planText = localStorage.getItem('studyPlan');
        if (!planText) { router.replace('/'); return; }
        const savedProgress = localStorage.getItem('studyProgress');
        const parsedPlan = parsePlan(planText);
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            parsedPlan.modules.forEach(m => m.topics.forEach(t => { if (progress[t.id]) t.completed = true; }));
        }
        setPlan(parsedPlan);
        setHydrated(true);
    }, [router]);

    const handleToggleTopic = (topicId: string) => {
        setPlan(prevPlan => {
            if (!prevPlan) return null;
            const newPlan = { ...prevPlan, modules: prevPlan.modules.map(m => ({ ...m, topics: m.topics.map(t => ({...t})) })) };
            for (const module of newPlan.modules) {
                const topic = module.topics.find(t => t.id === topicId);
                if (topic) {
                    topic.completed = !topic.completed;
                    break;
                }
            }
            const progress: { [key: string]: boolean } = {};
            newPlan.modules.forEach(m => m.topics.forEach(t => { if (t.completed) progress[t.id] = true; }));
            localStorage.setItem('studyProgress', JSON.stringify(progress));
            return newPlan;
        });
    };

    const { totalTopics, completedTopics, progressPercentage } = useMemo(() => {
        if (!plan) return { totalTopics: 0, completedTopics: 0, progressPercentage: 0 };
        const allTopics = plan.modules.flatMap(m => m.topics);
        return { totalTopics: allTopics.length, completedTopics: allTopics.filter(t => t.completed).length, progressPercentage: allTopics.length > 0 ? Math.round((allTopics.filter(t => t.completed).length / allTopics.length) * 100) : 0 };
    }, [plan]);

    if (!hydrated) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg">Loading your personalized plan...</p></div>;
    }
    
    if (!plan || plan.modules.length === 0) {
        return (
          <Card>
            <CardHeader><CardTitle>Plan Generation Error</CardTitle></CardHeader>
            <CardContent>
              <p>We couldn't generate a study plan from the provided information. Please go back and try again with more specific details.</p>
              <Button onClick={() => router.push('/')} className="mt-4">Go Back</Button>
            </CardContent>
          </Card>
        );
    }

    return (
        <div className="space-y-8">
            <Card className="shadow-lg border-2 border-primary/10">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl flex flex-wrap items-center gap-2"><Rocket className="text-accent" /> {plan.title}</CardTitle>
                    <CardDescription>Here is your personalized roadmap to success. Track your progress and conquer each module.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm font-medium"><span className="text-base">Overall Progress</span><Badge variant="secondary">{completedTopics} / {totalTopics} Topics</Badge></div>
                        <Progress value={progressPercentage} className="h-3" />
                        <div className="text-right text-sm text-muted-foreground">{progressPercentage}% Complete</div>
                    </div>
                </CardContent>
            </Card>

            {progressPercentage === 100 && (
                <Alert className="bg-green-100/50 border-green-400/50 text-green-900 dark:bg-green-900/50 dark:border-green-700/50 dark:text-green-200">
                    <PartyPopper className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertTitle className="font-bold">Congratulations!</AlertTitle>
                    <AlertDescription>You've completed your study plan. Keep revising and practicing to ace your exams!</AlertDescription>
                </Alert>
            )}

            <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={plan.modules[0]?.id}>
                {plan.modules.map((module) => (
                    <AccordionItem value={module.id} key={module.id} className="bg-card border-b-0 rounded-lg shadow-md overflow-hidden">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline font-headline text-lg data-[state=open]:bg-secondary/50">
                            <div className="flex items-center gap-3"><BookCheck className="text-primary h-6 w-6"/>{module.title}</div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 bg-card">
                            <div className="space-y-4">
                               <p className="text-muted-foreground italic">Complete the topics below to master this module.</p>
                                <div className="space-y-3">
                                    {module.topics.map((topic) => (
                                        <div key={topic.id} className="flex items-center space-x-3 p-3 rounded-md transition-colors hover:bg-background border">
                                            <Checkbox id={topic.id} checked={topic.completed} onCheckedChange={() => handleToggleTopic(topic.id)} aria-label={`Mark ${topic.text} as complete`} />
                                            <label htmlFor={topic.id} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer ${topic.completed ? 'line-through text-muted-foreground' : ''}`}>{topic.text}</label>
                                        </div>
                                    ))}
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild><Button className="mt-4 bg-primary hover:bg-primary/90"><BrainCircuit className="mr-2 h-4 w-4"/>Take Quiz</Button></DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]"><QuizComponent moduleTitle={module.title} /></DialogContent>
                                </Dialog>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
