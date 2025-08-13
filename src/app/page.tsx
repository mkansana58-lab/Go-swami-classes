import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const featuredCourses = [
  {
    title: 'NDA Foundation Course',
    description: 'A comprehensive course covering all subjects for the National Defence Academy entrance exam.',
    href: '/dashboard',
    icon: '🎯'
  },
  {
    title: 'Air Force X & Y Group',
    description: 'Specialized training for technical and non-technical trades in the Indian Air Force.',
    href: '/dashboard',
    icon: '✈️'
  },
    {
    title: 'Indian Navy SSR & AA',
    description: 'Prepare for the Senior Secondary Recruit and Artificer Apprentice roles in the Indian Navy.',
    href: '/dashboard',
    icon: '⚓'
  }
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20 text-center bg-gradient-to-b from-primary/5 to-transparent">
            <div className="container mx-auto px-4 md:px-6">
                <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-primary">
                Your Future in Defence Starts Here
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Go Swami Defence Academy offers expert guidance and personalized study tracks to help you achieve your dream of serving the nation.
                </p>
                <div className="mt-8">
                <Button asChild size="lg">
                    <Link href="/dashboard">
                    Explore Courses <ArrowRight className="ml-2" />
                    </Link>
                </Button>
                </div>
            </div>
        </section>
        
        <section className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
                 <h2 className="text-3xl font-bold text-center mb-10">Our Core Programs</h2>
                 <div className="grid md:grid-cols-3 gap-8">
                    {featuredCourses.map(course => (
                        <Card key={course.title} className="flex flex-col hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            <CardHeader className="flex-row items-start gap-4">
                                <div className="text-4xl">{course.icon}</div>
                                <div>
                                    <CardTitle className="font-headline text-xl">{course.title}</CardTitle>
                                    <CardDescription>{course.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow flex items-end">
                                <Button asChild variant="secondary" className="w-full">
                                    <Link href={course.href}>View Details</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>

      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Go Swami Defence Academy. All Rights Reserved.
      </footer>
    </div>
  );
}
