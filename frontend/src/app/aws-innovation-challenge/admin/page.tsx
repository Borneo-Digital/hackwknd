'use client';

import React, { useState, useEffect } from 'react';
import { MenuBar } from '@/components/MenuBar';
import { Footer } from '@/components/Footer';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  registeredAt: string;
}

export default function AWSRegistrationsAdmin() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const response = await fetch('/api/aws-registrations');
        if (!response.ok) {
          throw new Error('Failed to fetch registrations');
        }
        
        const data = await response.json();
        setRegistrations(data.registrations || []);
      } catch (err) {
        setError('Error loading registrations. Please try again later.');
        console.error('Error fetching registrations:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRegistrations();
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <MenuBar logo="HackWknd" logoSrc="/icon-hackwknd.svg" />
      
      <main className="container mx-auto px-4 py-12 pt-24">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">AWS Innovation Challenge Registrations</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
            {error}
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/50 rounded-lg">
            <p className="text-gray-400">No registrations yet.</p>
          </div>
        ) : (
          <div className="bg-slate-800/30 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800/80">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Age
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Registered At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{registration.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{registration.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{registration.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{registration.age || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{formatDate(registration.registeredAt)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <p className="text-sm text-gray-400">Total Registrations: {registrations.length}</p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}