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

        {/* Collaboration Section */}
        <div className="mt-12">
          <span className="text-hack-primary font-semibold mb-6 block text-center">In collaboration with</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-xs p-4 flex justify-center">
                <Image
                  src="/unimas-white-logo.png"
                  alt="UNIMAS Logo"
                  width={180}
                  height={180}
                  className="object-contain max-h-24"
                />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-xs p-4 flex justify-center">
                <Image
                  src="/bd-logo-white.png"
                  alt="BD Logo"
                  width={180}
                  height={180}
                  className="object-contain max-h-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}