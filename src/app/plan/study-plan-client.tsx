"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { BookCheck, BrainCircuit, Rocket, Trophy, Loader2, PartyPopper, BookOpen, Youtube, PlusCircle, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getFixedContent, type StudyPlan, type Module, type Topic } from '@/lib/content-service';
import Link from 'next/link';

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

const ResourcesComponent = ({ moduleTitle }: { moduleTitle: string }) => {
    const resources = {
        books: [
            { title: `Pathfinder for NDA & NA`, author: 'Arihant Experts', link: '#' },
            { title: `Quantitative Aptitude for Competitive Examinations`, author: 'R.S. Aggarwal', link: '#' },
        ],
        videos: [
            { title: `Top 50 GK Questions for NDA`, channel: 'Defence Wallah', link: '#' },
            { title: `Complete Guide to Crack NDA`, channel: 'Unacademy', link: '#' }
        ]
    }

    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><BookOpen className="text-primary"/>Recommended Books</h4>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                    {resources.books.map(book => <li key={book.title}>
                        <a href={book.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline"><strong>{book.title}</strong> by {book.author}</a>
                    </li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><Youtube className="text-destructive"/>Helpful Videos</h4>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                    {resources.videos.map(video => <li key={video.title}>
                        <a href={video.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline"><strong>{video.title}</strong> on {video.channel}</a>
                    </li>)}
                </ul>
            </div>
        </div>
    )
}

export function StudyPlanClient() {
    const [plan, setPlan] = useState<StudyPlan | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [newTopicInputs, setNewTopicInputs] = useState<{[key: string]: string}>({});
    
    const searchParams = useSearchParams();
    const planId = searchParams.get('id');

    useEffect(() => {
        if (!planId) return;

        const allPlans = getFixedContent();
        const currentPlan = allPlans.find(p => p.id === planId);

        if (currentPlan) {
            const savedProgress = localStorage.getItem(`progress_${planId}`);
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                currentPlan.modules.forEach(m => m.topics.forEach(t => { if (progress[t.id]) t.completed = true; }));
            }
            setPlan(currentPlan);
        }
        
        setHydrated(true);
    }, [planId]);
    
    const updateProgressInStorage = (newPlan: StudyPlan) => {
        const progress: { [key: string]: boolean } = {};
        newPlan.modules.forEach(m => m.topics.forEach(t => { if (t.completed) progress[t.id] = true; }));
        localStorage.setItem(`progress_${plan.id}`, JSON.stringify(progress));
    };

    const handleToggleTopic = (topicId: string) => {
        setPlan(prevPlan => {
            if (!prevPlan) return null;
            const newPlan = { ...prevPlan, modules: prevPlan.modules.map(m => ({ ...m, topics: m.topics.map(t => ({...t})) })) };
            let topicFound = false;
            for (const module of newPlan.modules) {
                const topic = module.topics.find(t => t.id === topicId);
                if (topic) {
                    topic.completed = !topic.completed;
                    topicFound = true;
                    break;
                }
            }
            if (topicFound) {
                updateProgressInStorage(newPlan);
            }
            return newPlan;
        });
    };

    const handleAddTopic = (moduleId: string) => {
        const topicText = newTopicInputs[moduleId]?.trim();
        if (!topicText) return;

        setPlan(prevPlan => {
            if (!prevPlan) return null;
            const newPlan = { ...prevPlan, modules: prevPlan.modules.map(m => ({ ...m, topics: [...m.topics.map(t => ({...t}))] })) };
            const module = newPlan.modules.find(m => m.id === moduleId);
            if (module) {
                module.topics.push({
                    id: `topic-${moduleId}-custom-${Date.now()}`,
                    title: topicText,
                    completed: false,
                });
                updateProgressInStorage(newPlan);
            }
            return newPlan;
        });

        setNewTopicInputs(prev => ({...prev, [moduleId]: ''}));
    };

    const { totalTopics, completedTopics, progressPercentage } = useMemo(() => {
        if (!plan) return { totalTopics: 0, completedTopics: 0, progressPercentage: 0 };
        const allTopics = plan.modules.flatMap(m => m.topics);
        return { totalTopics: allTopics.length, completedTopics: allTopics.filter(t => t.completed).length, progressPercentage: allTopics.length > 0 ? Math.round((allTopics.filter(t => t.completed).length / allTopics.length) * 100) : 0 };
    }, [plan]);

    if (!hydrated) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg">Loading your study plan...</p></div>;
    }
    
    if (!plan || plan.modules.length === 0) {
        return (
          <Card>
            <CardHeader><CardTitle>Study Plan Not Found</CardTitle></CardHeader>
            <CardContent>
              <p>We couldn't find the study plan you were looking for. Please go back to the dashboard and select one.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard"><ArrowLeft className="mr-2"/>Back to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        );
    }

    return (
        <div className="space-y-8">
            <Card className="shadow-lg border-2 border-primary/10">
                <CardHeader>
                     <Button asChild variant="outline" size="sm" className="mb-4 w-fit">
                        <Link href="/dashboard"><ArrowLeft className="mr-2"/>Back to Dashboard</Link>
                    </Button>
                    <CardTitle className="font-headline text-3xl flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2"><Rocket className="text-accent" /> {plan.title}</div>
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
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
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                   <p className="text-muted-foreground italic">Complete the topics below to master this module.</p>
                                    <div className="space-y-3">
                                        {module.topics.map((topic) => (
                                            <div key={topic.id} className="flex items-center space-x-3 p-3 rounded-md transition-colors hover:bg-background border">
                                                <Checkbox id={topic.id} checked={topic.completed} onCheckedChange={() => handleToggleTopic(topic.id)} aria-label={`Mark ${topic.title} as complete`} />
                                                <label htmlFor={topic.id} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer ${topic.completed ? 'line-through text-muted-foreground' : ''}`}>{topic.title}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                        <Input 
                                            placeholder="Add your own topic..."
                                            value={newTopicInputs[module.id] || ''}
                                            onChange={(e) => setNewTopicInputs(prev => ({...prev, [module.id]: e.target.value}))}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTopic(module.id)}
                                        />
                                        <Button onClick={() => handleAddTopic(module.id)}><PlusCircle className="mr-2 h-4 w-4"/> Add Topic</Button>
                                    </div>

                                    <Dialog>
                                        <DialogTrigger asChild><Button className="mt-4"><BrainCircuit className="mr-2 h-4 w-4"/>Take Quiz</Button></DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]"><QuizComponent moduleTitle={module.title} /></DialogContent>
                                    </Dialog>
                                </div>
                                <div>
                                    <ResourcesComponent moduleTitle={module.title} />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
