import { headers } from 'next/headers';
import { auth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import ExamClient from './examClient';

export default async function ExamPage() {
    // Auth Guard
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect('/sign-in');
    };

    return <ExamClient user={session.user} />;
};