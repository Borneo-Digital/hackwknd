'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  hackathon_id: string;
  hackathons: {
    title: string;
  };
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*, hackathons(title)')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateRegistrationStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state to reflect change
      setRegistrations(
        registrations.map(reg => 
          reg.id === id ? { ...reg, status } : reg
        )
      );
    } catch (error) {
      console.error('Error updating registration status:', error);
    }
  }

  const filteredRegistrations = registrations.filter(reg => {
    // Apply status filter
    if (activeFilter !== 'all' && reg.status !== activeFilter) {
      return false;
    }
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        reg.name.toLowerCase().includes(searchLower) ||
        reg.email.toLowerCase().includes(searchLower) ||
        reg.phone.toLowerCase().includes(searchLower) ||
        (reg.hackathons?.title || '').toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Get the total count for each status type
  const counts = {
    all: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    confirmed: registrations.filter(r => r.status === 'confirmed').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  };

  function exportToCSV() {
    // Convert data to CSV
    const headers = ['Name', 'Email', 'Phone', 'Hackathon', 'Status', 'Registration Date'];
    
    const csvRows = [headers];
    
    filteredRegistrations.forEach(reg => {
      csvRows.push([
        reg.name,
        reg.email,
        reg.phone,
        reg.hackathons?.title || 'N/A',
        reg.status || 'pending',
        new Date(reg.created_at).toLocaleDateString()
      ]);
    });
    
    // Convert array to CSV string
    const csvString = csvRows
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Create download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <svg className="animate-spin h-10 w-10 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600">Loading registrations...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Registrations</h1>
        <p className="text-gray-600">Manage hackathon registrations</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeFilter === 'all'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
                <span className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-xs">
                  {counts.all}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeFilter === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pending
                <span className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-xs">
                  {counts.pending}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('confirmed')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeFilter === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Confirmed
                <span className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-xs">
                  {counts.confirmed}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('rejected')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeFilter === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Rejected
                <span className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-xs">
                  {counts.rejected}
                </span>
              </button>
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search registrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <button
                onClick={exportToCSV}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Export to CSV
              </button>
            </div>
          </div>
        </div>

        {filteredRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hackathon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {registration.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.hackathons?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(registration.status || 'pending')}`}>
                        {registration.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(registration.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="inline-flex shadow-sm rounded-md">
                        <button
                          onClick={() => updateRegistrationStatus(registration.id, 'confirmed')}
                          className={`px-3 py-1 rounded-l-md text-xs border border-r-0 ${
                            registration.status === 'confirmed'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateRegistrationStatus(registration.id, 'pending')}
                          className={`px-3 py-1 text-xs border ${
                            registration.status === 'pending' || !registration.status
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => updateRegistrationStatus(registration.id, 'rejected')}
                          className={`px-3 py-1 rounded-r-md text-xs border border-l-0 ${
                            registration.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="mt-4 text-lg">No registrations found</p>
            <p className="mt-2">
              {activeFilter !== 'all' || searchTerm
                ? 'Try changing your filters or search term'
                : 'Registrations will appear here when people sign up'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}