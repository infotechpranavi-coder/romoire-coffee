import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from "../components/ui/toaster"
import { Toaster as Sonner } from "../components/ui/sonner"
import { TooltipProvider } from "../components/ui/tooltip"
import { InquiryFormProvider } from "../contexts/InquiryFormContext"
import { CategoryLabelsProvider } from "../contexts/CategoryLabelsContext"
import ConditionalLayout from "../components/ConditionalLayout"
import { SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE, LOGO_SRC } from "../lib/branding"

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

/** Garet fallback — geometric sans similar to reference body type */
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
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
      <body
        className={`${playfair.variable} ${cormorant.variable} ${manrope.variable} font-body bg-cream text-foreground antialiased`}
        style={{ ['--font-garet' as string]: 'var(--font-manrope)' }}
        suppressHydrationWarning
      >
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
