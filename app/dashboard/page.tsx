'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user role from cookie and redirect to appropriate dashboard
    const roleMatch = document.cookie.match(/user-role=([^;]+)/);
    const role = roleMatch ? decodeURIComponent(roleMatch[1]) : null;

    if (role === 'CEO' || role === 'ADMIN') {
      router.push('/dashboard/ceo');
    } else {
      // Redirect to user's department dashboard
      const deptMatch = document.cookie.match(/user-department=([^;]+)/);
      const dept = deptMatch ? decodeURIComponent(deptMatch[1]) : 'support';
      router.push(`/dashboard/${dept}`);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
}
