'use client';

import Image from 'next/image'
import React from 'react'

export function Footer() {
  return (
    <footer className="border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Organizer Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center">
            <span className="text-hack-primary font-semibold mb-6">An initiative by</span>
            <div className="relative w-full max-w-xs flex justify-center">
              <Image
                src="/SDEC-white.png"
                alt="SDEC Logo"
                width={300}
                height={120}
                className="w-64 h-auto object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-hack-secondary font-semibold mb-6">A part of</span>
            <div className="relative w-full max-w-xs flex justify-center">
              <Image
                src="/sarawak-digital-white.png"
                alt="Sarawak Digital Logo"
                width={150}
                height={150}
                className="w-32 h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} HackWknd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}