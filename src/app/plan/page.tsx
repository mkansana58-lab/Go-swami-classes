import { Header } from '@/components/header';
import { StudyPlanClient } from './study-plan-client';

export default function PlanPage() {
    return (
        <div className="flex flex-col min-h-dvh bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
                <StudyPlanClient />
            </main>
            <footer className="py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Go Swami Defence Academy. All Rights Reserved.
            </footer>
        </div>
    );
}
