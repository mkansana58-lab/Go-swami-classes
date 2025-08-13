import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAdminModules } from '@/lib/actions';
import { CreateContentForm } from './create-content-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';


export default async function ContentManagementPage() {
  const { modules } = await getAdminModules();

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Content Management</CardTitle>
                    <CardDescription>
                        Create new modules and topics for students.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/admin">
                    Back to Dashboard
                    <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <CreateContentForm />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Existing Modules</CardTitle>
                <CardDescription>
                    These modules are available for students to add to their plans.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {modules.length > 0 ? (
                    modules.map((module) => (
                        <div key={module.id} className="p-4 border rounded-lg">
                            <h3 className="font-semibold text-lg">{module.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {module.topics.map((topic, index) => (
                                    <Badge key={index} variant="secondary">{topic}</Badge>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground text-center">No modules created yet.</p>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
