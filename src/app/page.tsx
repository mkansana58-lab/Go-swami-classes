import { Header } from '@/components/header';
import { StudyPlanForm } from '@/components/study-plan-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">
              Welcome to Go Swami Defence Academy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Your personalized path to success. Generate your custom study plan below and start your journey with us.
            </p>
          </section>
          
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-2 border-primary/10">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Create Your Personalized Study Plan</CardTitle>
                <CardDescription>
                  Tell us about your goals and current knowledge to generate a plan tailored just for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StudyPlanForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Go Swami Defence Academy. All Rights Reserved.
      </footer>
    </div>
  );
}
