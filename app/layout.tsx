import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "../components/ui/toaster"
import { Toaster as Sonner } from "../components/ui/sonner"
import { TooltipProvider } from "../components/ui/tooltip"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import FloatingButtons from "../components/FloatingButtons"
import { InquiryFormProvider } from "../contexts/InquiryFormContext"
import { CategoryLabelsProvider } from "../contexts/CategoryLabelsContext"
import ConditionalLayout from "../components/ConditionalLayout"
import { SITE_NAME, SITE_DESCRIPTION, LOGO_SRC } from "../lib/branding"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${SITE_NAME} | Premium Coffee Beans & Specialty Roasts`,
  description: SITE_DESCRIPTION,
  icons: {
    icon: LOGO_SRC,
    apple: LOGO_SRC,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#FAF6F0]`} suppressHydrationWarning>
        <TooltipProvider>
          <CategoryLabelsProvider>
            <InquiryFormProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <Toaster />
              <Sonner />
            </InquiryFormProvider>
          </CategoryLabelsProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}

