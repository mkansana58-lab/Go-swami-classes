import { Header } from '@/components/header';
import { StudyPlanClient } from './study-plan-client';
import { AppLayout } from '@/components/app-layout';

export default function PlanPage() {
    return (
        <AppLayout>
            <StudyPlanClient />
        </AppLayout>
    );
}
