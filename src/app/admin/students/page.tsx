import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const mockStudents = [
  { id: 'usr_1', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', planProgress: 75, lastActive: '2 hours ago' },
  { id: 'usr_2', name: 'Priya Patel', email: 'priya.patel@example.com', planProgress: 40, lastActive: '1 day ago' },
  { id: 'usr_3', name: 'Amit Singh', email: 'amit.singh@example.com', planProgress: 100, lastActive: '5 hours ago' },
  { id: 'usr_4', name: 'Sneha Reddy', email: 'sneha.reddy@example.com', planProgress: 15, lastActive: '3 days ago' },
  { id: 'usr_5', name: 'Vikram Kumar', email: 'vikram.kumar@example.com', planProgress: 90, lastActive: '20 mins ago' },
];

export default function StudentsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Students</CardTitle>
            <CardDescription>
            A list of all students in the academy.
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {student.email}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={student.planProgress === 100 ? 'default' : 'secondary'}>
                    {student.planProgress}% complete
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{student.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
