import Image from 'next/image'
import React from 'react'

export function Footer() {
  return (
    <footer className="border-t border-gray-800">
      {/* Organizer Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center">
            <span className="text-hack-primary font-semibold mb-6">An initiative by</span>
            <div className="relative w-full max-w-xs p-4">
              <Image
                src="/SDEC-white.png"
                alt="SDEC Logo"
                width={250}
                height={100}
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-hack-secondary font-semibold mb-6">A part of</span>
            <div className="relative w-full max-w-xs p-4 flex justify-center">
              <Image
                src="/sarawak-digital-white.png"
                alt="Sarawak Digital Logo"
                width={180}
                height={180}
                className="object-contain max-h-24"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-gray-400 text-center text-sm">
            &copy; {new Date().getFullYear()} HackWeekend. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}