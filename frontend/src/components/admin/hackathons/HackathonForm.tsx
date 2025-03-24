'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LucideSave, LucideArrowLeft, LucideLoader } from 'lucide-react';
import { adminAPI } from '@/lib/admin/api';
import { Hackathon } from '@/types/hackathon';
import ReactMarkdown from 'react-markdown';

interface HackathonFormProps {
  hackathon?: Partial<Hackathon>;
  isEditing?: boolean;
}

export default function HackathonForm({ hackathon, isEditing = false }: HackathonFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Title: hackathon?.Title || '',
    Theme: hackathon?.Theme || '',
    Date: hackathon?.Date ? new Date(hackathon.Date).toISOString().split('T')[0] : '',
    Location: hackathon?.Location || '',
    Description: hackathon?.Description || '',
    slug: hackathon?.slug || '',
    EventStatus: hackathon?.EventStatus || 'Upcoming',
    RegistrationStartDate: hackathon?.RegistrationStartDate || '',
    RegistrationEndDate: hackathon?.RegistrationEndDate || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isEditing && hackathon?.id) {
        await adminAPI.updateHackathon(hackathon.id, formData);
      } else {
        await adminAPI.createHackathon(formData);
      }
      router.push('/admin/hackathons');
      router.refresh();
    } catch (err) {
      console.error('Error saving hackathon:', err);
      setError('Failed to save hackathon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Hackathon' : 'Create New Hackathon'}
        </h1>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <LucideArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="Title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
              </label>
              <input
                type="text"
                id="Title"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="Theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme *
              </label>
              <input
                type="text"
                id="Theme"
                name="Theme"
                value={formData.Theme}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="Date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Date *
              </label>
              <input
                type="date"
                id="Date"
                name="Date"
                value={formData.Date}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="Location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location *
              </label>
              <input
                type="text"
                id="Location"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="your-hackathon-name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Used in the URL: /hackathon/your-slug
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="EventStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status *
              </label>
              <select
                id="EventStatus"
                name="EventStatus"
                value={formData.EventStatus}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Finished">Finished</option>
              </select>
            </div>

            <div>
              <label htmlFor="RegistrationStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Registration Start Date *
              </label>
              <input
                type="date"
                id="RegistrationStartDate"
                name="RegistrationStartDate"
                value={formData.RegistrationStartDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="RegistrationEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Registration End Date *
              </label>
              <input
                type="date"
                id="RegistrationEndDate"
                name="RegistrationEndDate"
                value={formData.RegistrationEndDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="Description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description * (Supports markdown: use * for bullets, ** for bold, etc.)
              </label>
              <textarea
                id="Description"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="# Hackathon Description
                
* Point 1 - Use asterisks for bullet points
* Point 2 - Format **bold text** using double asterisks
* Point 3 - Create lists and structure your content"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
              />
              
              {formData.Description && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview:
                  </label>
                  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900 prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{formData.Description}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <LucideLoader className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <LucideSave className="h-4 w-4 mr-2" />
                Save Hackathon
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}