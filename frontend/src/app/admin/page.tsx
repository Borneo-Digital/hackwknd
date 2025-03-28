'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

interface DashboardStats {
  hackathonsCount: number;
  registrationsCount: number;
  recentRegistrations: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    hackathonsCount: 0,
    registrationsCount: 0,
    recentRegistrations: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        // Get hackathons count
        const { count: hackathonsCount } = await supabase
          .from('hackathons')
          .select('*', { count: 'exact', head: true });

        // Get registrations count
        const { count: registrationsCount } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true });

        // Get recent registrations
        const { data: recentRegistrations } = await supabase
          .from('registrations')
          .select('*, hackathons(title)')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          hackathonsCount: hackathonsCount || 0,
          registrationsCount: registrationsCount || 0,
          recentRegistrations: recentRegistrations || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <svg className="animate-spin h-10 w-10 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your hackathon management dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="Hackathons"
          value={stats.hackathonsCount}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>}
          linkText="Manage Hackathons"
          linkHref="/admin/hackathons"
          color="bg-blue-500"
        />
        <DashboardCard
          title="Registrations"
          value={stats.registrationsCount}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>}
          linkText="View Registrations"
          linkHref="/admin/registrations"
          color="bg-green-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Recent Registrations</h2>
        </div>
        <div className="p-6">
          {stats.recentRegistrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hackathon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentRegistrations.map((registration) => (
                    <tr key={registration.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{registration.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{registration.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{registration.hackathons?.title || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registration.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No recent registrations found.</div>
          )}
        </div>
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <Link
            href="/admin/registrations"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all registrations
          </Link>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
  color: string;
}

function DashboardCard({ title, value, icon, linkText, linkHref, color }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-md ${color} bg-opacity-10`}>
            <div className={`text-white ${color}`}>{icon}</div>
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-medium text-gray-700">{title}</h3>
            <div className="text-3xl font-bold mt-1">{value}</div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <Link
          href={linkHref}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
}