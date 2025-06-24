'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import EmailModal from '@/components/admin/EmailModal';
import { SendTemplateEmailRequest } from '@/types/email';
import { toast } from 'sonner';

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
  const [hackathons, setHackathons] = useState<{id: string; title: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeHackathonFilter, setActiveHackathonFilter] = useState<string | null>(null);
  
  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<{name: string; email: string; hackathon_id: string}[]>([]);
  const [activeHackathonTitle, setActiveHackathonTitle] = useState<string>('');
  const [isEmailSending, setIsEmailSending] = useState(false);

  useEffect(() => {
    fetchRegistrations();
    fetchHackathons();
  }, []);

  async function fetchHackathons() {
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .select('id, title')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setHackathons(data || []);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    }
  }

  async function fetchRegistrations() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*, hackathons(id, title)')
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
    
    // Apply hackathon filter
    if (activeHackathonFilter && reg.hackathon_id !== activeHackathonFilter) {
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

  // Get the total count for each status type - for currently filtered hackathon if one is selected
  const filteredByHackathon = activeHackathonFilter 
    ? registrations.filter(r => r.hackathon_id === activeHackathonFilter)
    : registrations;
    
  const counts = {
    all: filteredByHackathon.length,
    pending: filteredByHackathon.filter(r => r.status === 'pending').length,
    confirmed: filteredByHackathon.filter(r => r.status === 'confirmed').length,
    rejected: filteredByHackathon.filter(r => r.status === 'rejected').length,
  };

  // Confirm all pending registrations for a specific hackathon
  async function confirmAllPending(hackathonId: string) {
    // Using toast confirmation instead of native confirm
    toast.promise(
      new Promise((resolve, reject) => {
        // Create a custom toast with confirmation
        toast.custom((t) => (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="font-semibold mb-2">Confirm All Registrations</div>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to confirm all pending registrations for this hackathon?</p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => {
                  toast.dismiss(t);
                  reject();
                }}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  toast.dismiss(t);
                  resolve(true);
                }}
                className="px-3 py-1 bg-hack-primary text-white rounded text-sm"
              >
                Confirm All
              </button>
            </div>
          </div>
        ), { duration: 10000 });
      }),
      {
        loading: 'Processing confirmation...',
        success: () => {
          // Handle the actual confirmation process
          processConfirmAllPending(hackathonId);
          return 'Starting confirmation process...';
        },
        error: () => 'Confirmation cancelled',
      }
    );
  }

  // Actual logic for confirming all pending registrations
  async function processConfirmAllPending(hackathonId: string) {
    const pendingIds = registrations
      .filter(reg => reg.hackathon_id === hackathonId && (reg.status === 'pending' || !reg.status))
      .map(reg => reg.id);
      
    if (pendingIds.length === 0) {
      toast.warning("No pending registrations found.");
      return;
    }
    
    try {
      // Update all in one batch with Supabase
      const { error } = await supabase
        .from('registrations')
        .update({ status: 'confirmed' })
        .in('id', pendingIds);
        
      if (error) throw error;
      
      // Update local state
      setRegistrations(
        registrations.map(reg => 
          pendingIds.includes(reg.id) ? { ...reg, status: 'confirmed' } : reg
        )
      );
      
      toast.success(`Successfully confirmed ${pendingIds.length} registrations`, {
        description: `${pendingIds.length} participants have been confirmed.`,
        duration: 5000
      });
    } catch (error) {
      console.error('Error batch confirming registrations:', error);
      toast.error('Failed to confirm registrations', {
        description: 'There was an error updating the registration status.',
        duration: 5000
      });
    }
  }
  
  // Send bulk email to participants
  async function sendBulkEmail(hackathonId: string, targetStatus: 'all' | 'confirmed' | 'pending' | 'rejected') {
    // Get the hackathon details with partnership logos
    try {
      // First get basic hackathon info
      const hackathon = hackathons.find(h => h.id === hackathonId);
      if (!hackathon) {
        toast.error("Hackathon not found");
        return;
      }
      
      // Get full hackathon details including partnership logos
      const { data: hackathonDetails, error } = await supabase
        .from('hackathons')
        .select('*')
        .eq('id', hackathonId)
        .single();
        
      if (error) {
        console.error('Error fetching hackathon details:', error);
        toast.error("Error fetching hackathon details");
        return;
      }
      
      // Filter registrations based on hackathon and target status
      let targetRegistrations = registrations.filter(reg => reg.hackathon_id === hackathonId);
      
      if (targetStatus !== 'all') {
        targetRegistrations = targetRegistrations.filter(reg => reg.status === targetStatus);
      }
      
      if (targetRegistrations.length === 0) {
        toast.warning(`No ${targetStatus} registrations found for this hackathon.`);
        return;
      }
      
      // Parse partnership logos if they exist
      let partnershipLogos = [];
      try {
        if (hackathonDetails.partnership_logos) {
          partnershipLogos = typeof hackathonDetails.partnership_logos === 'string' 
            ? JSON.parse(hackathonDetails.partnership_logos) 
            : hackathonDetails.partnership_logos;
        }
      } catch (e) {
        console.error('Error parsing partnership logos:', e);
        // Continue without partnership logos if there's an error
      }
      
      // Format recipients
      const recipients = targetRegistrations.map(reg => ({
        name: reg.name,
        email: reg.email,
        hackathon_id: reg.hackathon_id,
        partnershipLogos
      }));
      
      // Set modal data
      setEmailRecipients(recipients);
      setActiveHackathonTitle(hackathon.title);
      setIsEmailModalOpen(true);
    } catch (error) {
      console.error('Error preparing to send bulk email:', error);
      toast.error("Error preparing to send bulk email");
    }
  }
  
  // Handle email sending from modal
  async function handleSendEmail(emailRequests: SendTemplateEmailRequest[]) {
    if (isEmailSending) return; // Prevent double submission
    
    setIsEmailSending(true);
    
    try {
      // Track success and failure counts
      let successCount = 0;
      let failureCount = 0;
      
      // Send emails in batches to avoid overloading the server
      const batchSize = 5;
      const batches = [];
      
      // Split into batches
      for (let i = 0; i < emailRequests.length; i += batchSize) {
        batches.push(emailRequests.slice(i, i + batchSize));
      }
      
      // Create a progress indicator
      const totalBatches = batches.length;
      let completedBatches = 0;
      
      // Send each batch sequentially
      for (const batch of batches) {
        completedBatches++;
        console.log(`Processing batch ${completedBatches} of ${totalBatches}...`);
        
        const results = await Promise.allSettled(
          batch.map(async request => {
            try {
              const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
              });
              
              if (!response.ok) {
                // Try to get more detailed error information
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Email API error details:', errorData);
                throw new Error(`API error: ${response.status} ${response.statusText}`);
              }
              
              return response;
            } catch (err) {
              console.error('Email request error:', err);
              throw err;
            }
          })
        );
        
        // Count successes and failures
        results.forEach(result => {
          if (result.status === 'fulfilled' && result.value.ok) {
            successCount++;
          } else {
            failureCount++;
            if (result.status === 'rejected') {
              console.error('Email request failed:', result.reason);
            } else if (result.status === 'fulfilled' && !result.value.ok) {
              console.error('Email API returned error:', result.value.statusText);
            }
          }
        });
      }
      
      // Show the results
      if (failureCount === 0) {
        toast.success(`Successfully sent ${successCount} emails.`);
      } else {
        toast(`Sent ${successCount} emails successfully. Failed to send ${failureCount} emails.`, {
          description: "Check console for more details.",
          icon: "⚠️"
        });
      }
      
      // Close the modal
      setIsEmailModalOpen(false);
    } catch (error) {
      console.error('Error sending emails:', error);
      toast.error('Failed to send emails. Please try again.');
    } finally {
      setIsEmailSending(false);
    }
  }
  
  // Export registrations to CSV with optional hackathon filter
  function exportToCSV(hackathonId?: string | null) {
    // Determine which registrations to export - either filtered by hackathon or all filtered registrations
    const dataToExport = hackathonId 
      ? filteredRegistrations.filter(reg => reg.hackathon_id === hackathonId)
      : filteredRegistrations;
      
    if (dataToExport.length === 0) {
      toast.warning("No data to export");
      return;
    }
    
    // Headers for the CSV
    const headers = ['Name', 'Email', 'Phone', 'Hackathon', 'Status', 'Registration Date'];
    
    const csvRows = [headers];
    
    dataToExport.forEach(reg => {
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
    
    // Generate filename based on hackathon
    let filename = 'registrations';
    if (hackathonId) {
      const hackathonTitle = hackathons.find(h => h.id === hackathonId)?.title;
      if (hackathonTitle) {
        filename += `-${hackathonTitle.replace(/\s+/g, '-').toLowerCase()}`;
      }
    }
    filename += `-${new Date().toISOString().slice(0, 10)}.csv`;
    
    // Create download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success toast
    toast.success(`CSV file "${filename}" downloaded successfully`);
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-hack-primary/20 text-hack-primary border border-hack-primary/30 dark:text-hack-primary/90';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50';
      case 'rejected':
        return 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <svg className="animate-spin h-10 w-10 mx-auto text-hack-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-muted-foreground font-medium">Loading registrations...</p>
      </div>
    );
  }

  // Build hackathon statistics for the dashboard
  const hackathonStats = hackathons.map(hackathon => {
    const hackathonRegs = registrations.filter(reg => reg.hackathon_id === hackathon.id);
    return {
      ...hackathon,
      totalCount: hackathonRegs.length,
      confirmedCount: hackathonRegs.filter(reg => reg.status === 'confirmed').length,
      pendingCount: hackathonRegs.filter(reg => reg.status === 'pending' || !reg.status).length,
      rejectedCount: hackathonRegs.filter(reg => reg.status === 'rejected').length,
    };
  });

  return (
    <div className="container mx-auto px-4">
      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        recipients={emailRecipients}
        hackathonTitle={activeHackathonTitle}
        onSendEmail={handleSendEmail}
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hack-primary to-hack-secondary">Registrations</h1>
        <p className="text-muted-foreground mt-1">Review and manage hackathon participants</p>
      </div>
      
      {/* Hackathon Dashboard Cards - only show when no hackathon is selected */}
      {!activeHackathonFilter && hackathonStats.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Hackathon Registration Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hackathonStats.map(hackathon => (
              <div 
                key={hackathon.id}
                className="bg-card rounded-lg shadow-md p-5 border border-border hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => setActiveHackathonFilter(hackathon.id)}
              >
                <h3 className="font-bold text-lg mb-3 text-foreground">{hackathon.title}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted p-3 rounded-md text-center">
                    <div className="text-2xl font-bold text-foreground">{hackathon.totalCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">Total</div>
                  </div>
                  <div className="bg-hack-primary/10 p-3 rounded-md text-center">
                    <div className="text-2xl font-bold text-hack-primary">{hackathon.confirmedCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">Confirmed</div>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-md text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{hackathon.pendingCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">Pending</div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button 
                    className="text-sm text-hack-primary font-medium hover:text-hack-primary/80 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHackathonFilter(hackathon.id);
                    }}
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Hackathon Tabs */}
      <div className="bg-card rounded-t-lg shadow-md border border-border border-b-0 overflow-hidden">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveHackathonFilter(null)}
              className={`px-6 py-3 font-medium text-sm ${
                activeHackathonFilter === null 
                  ? 'border-b-2 border-hack-primary text-hack-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Hackathons
            </button>
            {hackathons.map(hackathon => (
              <button
                key={hackathon.id}
                onClick={() => setActiveHackathonFilter(hackathon.id)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeHackathonFilter === hackathon.id 
                    ? 'border-b-2 border-hack-primary text-hack-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {hackathon.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Filters and Search */}
      <div className="bg-card rounded-t-none rounded-b-none shadow-md overflow-hidden border border-border border-t-0 border-b-0">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeFilter === 'all'
                    ? 'bg-hack-secondary/20 text-hack-secondary shadow-sm dark:bg-hack-secondary/10 dark:text-hack-secondary/90'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                All
                <span className={`ml-2 ${activeFilter === 'all' ? 'bg-hack-secondary/10 text-hack-secondary dark:bg-hack-secondary/20 dark:text-hack-secondary/90' : 'bg-muted text-muted-foreground'} px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
                  {counts.all}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeFilter === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 shadow-sm dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Pending
                <span className={`ml-2 ${activeFilter === 'pending' ? 'bg-yellow-200/60 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-400' : 'bg-muted text-muted-foreground'} px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
                  {counts.pending}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('confirmed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeFilter === 'confirmed'
                    ? 'bg-hack-primary/20 text-hack-primary shadow-sm dark:bg-hack-primary/10 dark:text-hack-primary/90'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Confirmed
                <span className={`ml-2 ${activeFilter === 'confirmed' ? 'bg-hack-primary/10 text-hack-primary dark:bg-hack-primary/20 dark:text-hack-primary/90' : 'bg-muted text-muted-foreground'} px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
                  {counts.confirmed}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('rejected')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeFilter === 'rejected'
                    ? 'bg-red-100 text-red-700 shadow-sm dark:bg-red-900/30 dark:text-red-400'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Rejected
                <span className={`ml-2 ${activeFilter === 'rejected' ? 'bg-red-200/60 text-red-700 dark:bg-red-700/30 dark:text-red-400' : 'bg-muted text-muted-foreground'} px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
                  {counts.rejected}
                </span>
              </button>
            </div>
            
            <div className="flex space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted-foreground/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search registrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors w-64"
                />
              </div>
              
              <button
                onClick={() => exportToCSV(activeHackathonFilter)}
                className="flex items-center space-x-2 px-4 py-2.5 border border-hack-primary/30 rounded-lg shadow-sm text-sm font-medium text-hack-primary bg-card hover:bg-hack-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hack-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Hackathon-specific summary */}
        {activeHackathonFilter && (
          <div className="p-5 border-b border-border bg-muted/50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">
                {hackathons.find(h => h.id === activeHackathonFilter)?.title} - Registration Summary
              </h3>
              <button 
                onClick={() => setActiveHackathonFilter(null)}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear Filter
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="bg-card p-3 rounded-lg border border-border text-center">
                <div className="text-2xl font-bold text-foreground">
                  {registrations.filter(r => r.hackathon_id === activeHackathonFilter).length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Total Registrations</div>
              </div>
              
              <div className="bg-hack-primary/10 p-3 rounded-lg border border-hack-primary/20 text-center dark:bg-hack-primary/5">
                <div className="text-2xl font-bold text-hack-primary dark:text-hack-primary/90">
                  {registrations.filter(r => r.hackathon_id === activeHackathonFilter && r.status === 'confirmed').length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Confirmed</div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-900/30 text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {registrations.filter(r => r.hackathon_id === activeHackathonFilter && (r.status === 'pending' || !r.status)).length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Pending</div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/30 text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {registrations.filter(r => r.hackathon_id === activeHackathonFilter && r.status === 'rejected').length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Rejected</div>
              </div>
            </div>
            
            {/* Batch Actions */}
            <div className="mt-5 flex flex-wrap gap-2">
              <button 
                onClick={() => confirmAllPending(activeHackathonFilter)}
                className="px-3 py-1.5 text-xs rounded-md bg-hack-primary/10 text-hack-primary border border-hack-primary/20 hover:bg-hack-primary/20 transition-colors dark:bg-hack-primary/5 dark:text-hack-primary/90 dark:border-hack-primary/10 dark:hover:bg-hack-primary/10"
              >
                Confirm All Pending
              </button>
              <button 
                onClick={() => sendBulkEmail(activeHackathonFilter, 'all')}
                className="px-3 py-1.5 text-xs rounded-md bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30 dark:hover:bg-blue-900/30"
              >
                Email All Participants
              </button>
              <button 
                onClick={() => sendBulkEmail(activeHackathonFilter, 'confirmed')}
                className="px-3 py-1.5 text-xs rounded-md bg-muted text-muted-foreground border border-border hover:bg-muted/70 transition-colors"
              >
                Email Confirmed Only
              </button>
            </div>
          </div>
        )}

        {filteredRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hackathon</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registration Date</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRegistrations.map((registration, index) => (
                  <tr 
                    key={registration.id}
                    className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/50'} hover:bg-muted transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {registration.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {registration.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {registration.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {registration.hackathons?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(registration.status || 'pending')}`}>
                        {registration.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(registration.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="inline-flex shadow-sm rounded-md">
                          <button
                            onClick={() => updateRegistrationStatus(registration.id, 'confirmed')}
                            className={`px-3 py-1 rounded-l-md text-xs border border-r-0 transition-colors duration-200 ${
                              registration.status === 'confirmed'
                                ? 'bg-hack-primary/20 text-hack-primary border-hack-primary/30 dark:text-hack-primary/90'
                                : 'bg-card text-foreground border-border hover:bg-muted'
                            }`}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateRegistrationStatus(registration.id, 'pending')}
                            className={`px-3 py-1 text-xs border transition-colors duration-200 ${
                              registration.status === 'pending' || !registration.status
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50'
                                : 'bg-card text-foreground border-border hover:bg-muted'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => updateRegistrationStatus(registration.id, 'rejected')}
                            className={`px-3 py-1 rounded-r-md text-xs border border-l-0 transition-colors duration-200 ${
                              registration.status === 'rejected'
                                ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50'
                                : 'bg-card text-foreground border-border hover:bg-muted'
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                        
                        <button
                          onClick={() => {
                            setEmailRecipients([{
                              name: registration.name,
                              email: registration.email,
                              hackathon_id: registration.hackathon_id
                            }]);
                            setActiveHackathonTitle(registration.hackathons?.title || 'HackWknd');
                            setIsEmailModalOpen(true);
                          }}
                          className="p-1.5 rounded text-blue-600 hover:bg-blue-100/50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                          title="Send email to this participant"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No registrations found</h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              {activeFilter !== 'all' || searchTerm
                ? 'Try changing your search filters or using different search terms'
                : 'Registrations will appear here when people sign up for your hackathon events'}
            </p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hack-primary"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}