'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MenuBar } from "@/components/MenuBar"
import { Footer } from "@/components/Footer"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-grid bg-center opacity-10" />
      <MenuBar logo="HackWknd" logoSrc="/icon-hackwknd.svg" />

      <main className="container mx-auto px-4 py-32">
        <Card className="max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-sm border-gray-800">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <CheckCircle2 className="w-20 h-20 mx-auto text-hack-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 hack-gradient-text">
              Thank You for Registering!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              We are excited to have you join HackWknd. Check your email for confirmation details and next steps.
            </p>
            <Link href="/">
              <Button className="hack-button group">
                <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}