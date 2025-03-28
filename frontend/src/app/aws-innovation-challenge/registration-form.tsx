'use client';

import React, { useState } from 'react';
import { RegistrationData } from '@/types/registrations';

interface RegistrationFormProps {
  onClose: () => void;
}

export const AWSRegistrationForm: React.FC<RegistrationFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    confirmEmail: '',
    phone: '',
    age: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle age as a number
    if (name === 'age') {
      setFormData({ ...formData, [name]: value ? parseInt(value, 10) : undefined });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate email match
    if (formData.email !== formData.confirmEmail) {
      setError('Emails do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      // Check for existing registration
      const checkResponse = await fetch('/api/aws-registrations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const checkResult = await checkResponse.json();
      
      if (checkResult.exists) {
        setError('This email is already registered.');
        setIsSubmitting(false);
        return;
      }
      
      // Submit registration
      const response = await fetch('/api/aws-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: formData.age,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to register');
      }

      // Send confirmation email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.email,
          data: {
            name: formData.name,
            email: formData.email,
            age: formData.age,
          },
        }),
      });

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 bg-slate-900 text-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Registration Successful!</h2>
        <p className="text-gray-300 mb-4">
          Thank you for registering for the AWS Innovation Challenge! Please check your email for confirmation details.
        </p>
        <p className="text-sm text-gray-400">This window will close automatically...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Register for AWS Innovation Challenge</h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
          disabled={isSubmitting}
          className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email address"
          required
          disabled={isSubmitting}
          className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500"
        />
      </div>
      
      <div>
        <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-300 mb-1">Confirm Email</label>
        <input
          type="email"
          id="confirmEmail"
          name="confirmEmail"
          value={formData.confirmEmail}
          onChange={handleChange}
          placeholder="Confirm your email"
          required
          disabled={isSubmitting}
          className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your phone number"
          required
          disabled={isSubmitting}
          className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500"
        />
      </div>
      
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age || ''}
          onChange={handleChange}
          placeholder="Your age"
          min="15"
          max="100"
          required
          disabled={isSubmitting}
          className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Register Now'}
      </button>
      
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-300">
          {error}
        </div>
      )}
    </form>
  );
};