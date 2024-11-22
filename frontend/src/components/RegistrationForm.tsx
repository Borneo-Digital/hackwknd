import React, { useState } from 'react';
import { submitRegistration } from '@/lib/api';
import { RegistrationData } from '@/types/registrations';

interface RegistrationFormProps {
  onClose: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const success = await submitRegistration(formData);
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000); // Close after 3 seconds
      } else {
        setError('There was an error submitting the form. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-hack-primary">Registration Successful!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for registering! Please check your email for confirmation details.
        </p>
        <p className="text-sm text-gray-500">This window will close automatically...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card text-card-foreground rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register Here</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
        disabled={isSubmitting}
        className="w-full p-2 border border-input rounded-md"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        disabled={isSubmitting}
        className="w-full p-2 border border-input rounded-md"
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
        disabled={isSubmitting}
        className="w-full p-2 border border-input rounded-md"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {error && <p className="text-destructive">{error}</p>}
    </form>
  );
};