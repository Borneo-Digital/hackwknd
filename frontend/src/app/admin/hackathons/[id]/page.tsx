'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { use } from 'react';
import { PartnershipLogos } from '@/components/ui/partnership-logos';
import { PartnershipLogo } from '@/types/hackathon';

interface HackathonDetailProps {
  params: Promise<{ id: string }>;
}

export default function HackathonDetailPage({ params }: HackathonDetailProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    date: '',
    location: '',
    description: '',
    slug: '',
    event_status: '',
    registration_end_date: '',
    image_url: '',
    partnership_logos: [],
  });

  useEffect(() => {
    async function fetchHackathon() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('hackathons')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Parse JSON description if needed
          let description = '';
          if (data.description) {
            try {
              const descriptionObj = JSON.parse(data.description);
              // Extract text from the first paragraph if exists
              if (Array.isArray(descriptionObj) && descriptionObj.length > 0) {
                const firstParagraph = descriptionObj[0];
                if (firstParagraph.children && Array.isArray(firstParagraph.children)) {
                  description = firstParagraph.children.map((child: any) => child.text || '').join('');
                }
              }
            } catch (e) {
              description = data.description;
            }
          }

          // Format dates for datetime-local input
          const formatDateForInput = (dateString: string | null) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
          };

          let partnershipLogos = [];
          if (data.partnership_logos) {
            try {
              partnershipLogos = JSON.parse(data.partnership_logos);
            } catch (e) {
              console.error('Error parsing partnership logos:', e);
            }
          }

          setFormData({
            title: data.title || '',
            theme: data.theme || '',
            date: formatDateForInput(data.date),
            location: data.location || '',
            description: description,
            slug: data.slug || '',
            event_status: data.event_status || 'upcoming',
            registration_end_date: formatDateForInput(data.registration_end_date),
            image_url: data.image_url || '',
            partnership_logos: partnershipLogos,
          });
        }
      } catch (err: any) {
        console.error('Error fetching hackathon:', err);
        setError(err.message || 'Failed to load hackathon details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchHackathon();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePartnershipLogosChange = (logos: PartnershipLogo[]) => {
    setFormData(prev => ({
      ...prev,
      partnership_logos: logos
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Prepare data for update
      const updateData = {
        ...formData,
        // Convert dates to ISO format if they exist
        date: formData.date ? new Date(formData.date).toISOString() : null,
        registration_end_date: formData.registration_end_date ? new Date(formData.registration_end_date).toISOString() : null,
        // Update description as JSON if it changed
        description: JSON.stringify([
          {
            type: 'paragraph',
            children: [{ text: formData.description }]
          }
        ]),
      };
      
      // First check if the partnership_logos column exists
      try {
        // Try to query the column info
        const { error: columnCheckError } = await supabase
          .from('hackathons')
          .select('partnership_logos')
          .limit(1);
        
        // If no error, the column exists, so we can include it in the update
        if (!columnCheckError) {
          updateData.partnership_logos = JSON.stringify(formData.partnership_logos || []);
        } else {
          console.warn('partnership_logos column does not exist yet. Column needs to be added to the database.');
          // Show a warning to the user
          setError('Warning: Partnership logos cannot be saved until the database is updated. Please contact an administrator.');
        }
      } catch (e) {
        console.error('Error checking for partnership_logos column:', e);
      }

      const { error } = await supabase
        .from('hackathons')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      setSuccessMessage('Hackathon updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error updating hackathon:', err);
      setError(err.message || 'Failed to update hackathon');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <svg className="animate-spin h-10 w-10 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600">Loading hackathon details...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Hackathon</h1>
            <p className="text-gray-600">{formData.title}</p>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/hackathons')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to List
            </button>
            <a
              href={`/hackathon/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              View on Website
            </a>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">URL: /hackathon/{formData.slug}</p>
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <input
                type="text"
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="registration_end_date" className="block text-sm font-medium text-gray-700 mb-1">
                Registration End Date
              </label>
              <input
                type="datetime-local"
                id="registration_end_date"
                name="registration_end_date"
                value={formData.registration_end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="event_status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="event_status"
                name="event_status"
                value={formData.event_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="finished">Finished</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <PartnershipLogos 
              value={formData.partnership_logos}
              onChange={handlePartnershipLogosChange}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/hackathons')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Advanced Settings</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Schedule, Prizes, and FAQ</h3>
            <p className="text-gray-600">
              Configure event schedule, prizes, and FAQs for your hackathon. Click the button below to access advanced settings.
            </p>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => router.push(`/admin/hackathons/${id}/advanced`)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Advanced Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}