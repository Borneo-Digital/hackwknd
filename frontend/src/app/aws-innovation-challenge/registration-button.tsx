'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { AWSRegistrationForm } from './registration-form';

export function AWSRegistrationButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  return (
    <>
      <Button
        id="register"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-all hover:shadow-lg hover:from-blue-700 hover:to-indigo-700"
        onClick={openForm}
      >
        Register Your Team
        <span className="ml-2">→</span>
      </Button>
      
      <Modal isOpen={isFormOpen} onClose={closeForm}>
        <AWSRegistrationForm onClose={closeForm} />
      </Modal>
    </>
  );
}