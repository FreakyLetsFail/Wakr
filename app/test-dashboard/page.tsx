import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function TestDashboard() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Test Dashboard</h1>
      <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Login Successful! 🎉</h2>
        <p>Welcome, {session.user.name}!</p>
        <p>Email: {session.user.email}</p>
        <p>User ID: {session.user.id}</p>
      </div>
      <div className="mt-6 space-y-2">
        <a href="/dashboard" className="block text-blue-600 hover:underline">
          → Go to Main Dashboard
        </a>
        <a href="/dashboard/habits" className="block text-blue-600 hover:underline">
          → Go to Habits
        </a>
        <a href="/dashboard/analytics" className="block text-blue-600 hover:underline">
          → Go to Analytics
        </a>
      </div>
    </div>
  );
}