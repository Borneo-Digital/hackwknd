import React from 'react';
import { MenuBar } from '@/components/MenuBar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

// Client components in separate file
import { AWSRegistrationButton } from './registration-button';

export default function AWSInnovationChallenge() {
  return (
    <div className="relative">
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-grid bg-center opacity-10" />
        <MenuBar logo="HackWknd" logoSrc="/icon-hackwknd.svg" />

        <header className="relative pt-24 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-700/20 blur-3xl" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <img src="/hackwknd-logo.png" alt="Hackathon Weekend" className="h-16" />
                <span className="mx-4 text-gray-500 text-2xl flex items-center">×</span>
                <img src="https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB_stacked_REV_SQ.91cd4af40773cbfbd15577a3c2b8a346fe3e8fa2.png" alt="AWS" className="h-16" />
              </div>
              <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                Unleash Your Innovation with GenAI
              </h1>
              <p className="text-xl text-gray-300 mb-6">Join the AWS Innovation Challenge!</p>
              <div className="flex items-center justify-center space-x-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 border border-blue-500/50 text-blue-400">
                  Upcoming
                </span>
                <span className="text-gray-400">
                  Registration ends: April 5, 2025
                </span>
              </div>
              <div className="flex justify-center mt-8">
                <div className="inline-flex bg-gradient-to-r from-blue-500 to-indigo-600 p-[1px] rounded-full">
                  <a href="#register" className="bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors">
                    Register Your Team Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900/80 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                  <Image 
                    src="/hackwknd-logo.png" 
                    alt="AWS Innovation Challenge" 
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                <div className="text-blue-500 mb-4">$ cat about.md</div>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-indigo-400 font-bold text-lg">Welcome</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      We're excited to invite you to participate in an exciting and transformative experience designed to showcase your talent, foster innovation, and empower you with the tools to solve real-world problems using the power of GenAI and AWS services.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-indigo-400 font-bold text-lg">Event Overview</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      <strong className="text-blue-400">Innovation Meets Opportunity:</strong><br />
                      The AWS Innovation Challenge is an exclusive opportunity for developers, ISVs, and university students to showcase their skills, learn from AWS experts, and make a meaningful impact with GenAI. 
                      The challenge is built around conceptualizing solutions to real-world problems and using Amazon Q and PartyRock to build apps that can truly disrupt industries.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Whether you're an ISV looking to innovate for competitive advantage or a university student hoping to build a portfolio for future opportunities, this is your chance to #InnovateToDisrupt and #Hack2BeHired.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-indigo-400 font-bold text-lg">Event Highlights</h3>
                    <ul className="space-y-4 text-gray-300 mt-4">
                      <li>
                        <p className="font-medium text-blue-400">1. Virtual Workshop (April 9th)</p>
                        <p className="ml-6 text-gray-300">Gain hands-on experience with AWS Amazon Q and Bedrock led by AWS Solution Architects as you learn how to build GenAI applications in just a few prompts. A link will be sent after registration.</p>
                      </li>
                      <li>
                        <p className="font-medium text-blue-400">2. Physical Problem-Solving Workshop (April 16 to 17, 2025)</p>
                        <ul className="ml-6 space-y-2 mt-2">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="flex-1">Korn Ferry & RealFun workshop to refine your ideas - Work backward from business needs and develop solutions using AWS tools. (April 16)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="flex-1">Prepare, ideate, and build GENAI to a panel of judges (Apr 17)</span>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <p className="font-medium text-blue-400">3. Hackathon, Pitching & Awards (April 17, 2025)</p>
                        <p className="ml-6 text-gray-300">Present your GenAI-powered solutions to a panel of judges from AWS, SDEC, Korn Ferry, and RealFun.</p>
                        <ul className="ml-6 space-y-2 mt-2">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span className="flex-1">Winning ideas will be selected for AWS credits to continue development.</span>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-slate-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-blue-500 mb-4">Event Details</h3>
                <div className="space-y-6 font-mono">
                  <div className="flex items-center text-gray-300">
                    <div className="w-5 h-5 mr-3 text-blue-500">📅</div>
                    <div>
                      <span className="text-indigo-400 block text-sm">date:</span>
                      April 16-17, 2025
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-5 h-5 mr-3 text-blue-500">📍</div>
                    <div>
                      <span className="text-indigo-400 block text-sm">location:</span>
                      Makerspace Makeramai
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-5 h-5 mr-3 text-blue-500">🔄</div>
                    <div>
                      <span className="text-indigo-400 block text-sm">virtual workshop:</span>
                      April 9, 2025
                    </div>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-5 h-5 mr-3 text-blue-500">👥</div>
                    <div>
                      <span className="text-indigo-400 block text-sm">team size:</span>
                      5 members
                    </div>
                  </div>

                  <AWSRegistrationButton />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}