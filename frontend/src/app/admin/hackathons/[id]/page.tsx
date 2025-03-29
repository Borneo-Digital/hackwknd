'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { use } from 'react';
import { PartnershipLogos } from '@/components/ui/partnership-logos';
import { PosterGallery } from '@/components/ui/poster-gallery';
import { PartnershipLogo, PosterImage } from '@/types/hackathon';

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
    partnership_logos: [],
    poster_images: [],
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
          
          let posterImages = [];
          if (data.poster_images) {
            try {
              posterImages = JSON.parse(data.poster_images);
              // Ensure all images have an order property
              posterImages = posterImages.map((img, index) => ({
                ...img,
                order: img.order !== undefined ? img.order : index
              }));
              // Sort by order
              posterImages.sort((a, b) => a.order - b.order);
            } catch (e) {
              console.error('Error parsing poster images:', e);
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
            partnership_logos: partnershipLogos,
            poster_images: posterImages,
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
  
  const handlePosterImagesChange = (images: PosterImage[]) => {
    setFormData(prev => ({
      ...prev,
      poster_images: images
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
        // Check if columns exist
        const { error: columnCheckError } = await supabase
          .from('hackathons')
          .select('partnership_logos, poster_images')
          .limit(1);
        
        // If no error, the columns exist
        if (!columnCheckError) {
          // Add partnership logos if they exist
          updateData.partnership_logos = JSON.stringify(formData.partnership_logos || []);
          
          // Add poster images if they exist
          updateData.poster_images = JSON.stringify(formData.poster_images || []);
        } else {
          console.warn('Some columns may not exist yet. They need to be added to the database.');
          // Show a warning to the user
          setError('Warning: Some features cannot be saved until the database is updated. Please contact an administrator.');
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-800">Edit Hackathon</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium 
                ${formData.event_status === 'upcoming' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 
                  formData.event_status === 'ongoing' ? 'bg-green-100 text-green-800 border border-green-200' :
                  formData.event_status === 'finished' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                  'bg-yellow-100 text-yellow-800 border border-yellow-200'}`
              }>
                {formData.event_status.charAt(0).toUpperCase() + formData.event_status.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{formData.title}</p>
            {formData.date && (
              <p className="text-gray-500 text-sm mt-1">
                {new Date(formData.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View on Website
            </a>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm animate-pulse">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 p-1 rounded-full">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
              <p className="text-xs text-green-700 mt-1">You can continue editing or go back to the list.</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-auto bg-green-50 text-green-500 hover:text-green-700 focus:outline-none"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
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
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <PosterGallery
              value={formData.poster_images}
              onChange={handlePosterImagesChange}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-red-100 p-1 rounded-full">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{error}</p>
                    {error.includes('partnership_logos') && (
                      <p className="mt-2 text-xs">
                        This is a configuration issue. Please contact the system administrator to update the database schema.
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto bg-red-50 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.push('/admin/hackathons')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 flex items-center"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </>
              )}
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