'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function NewHackathonPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    date: '',
    location: '',
    description: '',
    slug: '',
    event_status: 'upcoming',
    registration_end_date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSlug = () => {
    if (!formData.title) return;
    
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
    
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert date strings to ISO format
      // Format dates properly for database
      const hackathonData = {
        ...formData,
        // Convert dates to ISO format if they exist
        date: formData.date ? new Date(formData.date).toISOString() : null,
        registration_end_date: formData.registration_end_date ? new Date(formData.registration_end_date).toISOString() : null,
        description: JSON.stringify([
          {
            type: 'paragraph',
            children: [{ text: formData.description }]
          }
        ]),
        schedule: JSON.stringify({ schedule: [] }),
        prizes: JSON.stringify({ prizes: {} }),
        faq: JSON.stringify([])
      };

      const { error, data } = await supabase
        .from('hackathons')
        .insert(hackathonData)
        .select()
        .single();

      if (error) throw error;

      // Redirect to the hackathon edit page
      router.push(`/admin/hackathons/${data.id}`);
    } catch (err: any) {
      console.error('Error creating hackathon:', err);
      setError(err.message || 'Failed to create hackathon');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hack-primary to-hack-secondary">Create New Hackathon</h1>
        <p className="text-muted-foreground mt-1">Add details for your new hackathon event</p>
      </div>

      <div className="bg-card rounded-lg shadow-md p-8 border border-border">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={generateSlug}
                required
                className="w-full px-4 py-2.5 border border-input bg-background rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                placeholder="HackWknd 2025"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1.5">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-input bg-background rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                  placeholder="hackwknd-2025"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="ml-2 px-4 py-2.5 border border-input bg-muted rounded-lg shadow-sm text-sm font-medium text-foreground hover:bg-muted/70 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Generate
                </button>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">This will be used in the URL: /hackathon/{formData.slug || 'your-slug'}</p>
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-foreground mb-1.5">
                Theme
              </label>
              <input
                type="text"
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input bg-background rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                placeholder="AI for Sustainability"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1.5">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input bg-background rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                placeholder="Kuching, Sarawak"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-foreground mb-1.5">
                Event Date
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input bg-background rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
              />
            </div>

            <div>
              <label htmlFor="registration_end_date" className="block text-sm font-medium text-foreground mb-1.5">
                Registration End Date
              </label>
              <input
                type="datetime-local"
                id="registration_end_date"
                name="registration_end_date"
                value={formData.registration_end_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input bg-background rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
              />
            </div>

            <div>
              <label htmlFor="event_status" className="block text-sm font-medium text-foreground mb-1.5">
                Status
              </label>
              <select
                id="event_status"
                name="event_status"
                value={formData.event_status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input bg-background rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="finished">Finished</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-input bg-background rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
              placeholder="Enter a brief description of your hackathon..."
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Basic description of the hackathon. You can add more detailed content after creation.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error creating hackathon</h3>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => router.push('/admin/hackathons')}
              className="px-4 py-2.5 border border-input rounded-lg shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-hack-primary hover:bg-hack-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hack-primary disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>Create Hackathon</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}