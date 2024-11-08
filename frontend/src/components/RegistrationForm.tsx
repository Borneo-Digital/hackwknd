import React, { useState } from 'react';
import { submitRegistration } from '@/lib/api';
import { RegistrationData } from '@/types/registrations'; // Add this import

interface RegistrationFormProps {
  onClose: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<RegistrationData>({ name: '', email: '', phone: '' });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitRegistration(formData);
    if (success) {
      alert('Form submitted successfully!');
      onClose();
    } else {
      setError('There was an error submitting the form. Please try again.');
    }
  };

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
        className="w-full p-2 border border-input rounded-md"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full p-2 border border-input rounded-md"
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
        className="w-full p-2 border border-input rounded-md"
      />
      <button type="submit" className="w-full p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
        Submit
      </button>
      {error && <p className="text-destructive">{error}</p>}
    </form>
  );
};