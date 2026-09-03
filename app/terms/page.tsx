import Link from 'next/link';
import { TERMS_PAGE_TITLE, TERMS_SECTIONS } from '@/lib/termsContent';
import { CONTACT_EMAIL, CONTACT_EMAIL_MAILTO, CONTACT_PHONE, CONTACT_PHONE_TEL } from '@/lib/branding';

export const metadata = {
  title: 'Terms of Use, Disclaimer & Limitation of Liability | Explore360',
  description:
    'Explore360 Terms of Use, Disclaimer and Limitation of Liability. Read our booking facilitator terms, assumption of risk, and liability policies.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative text-white py-28 md:py-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/360_F_573305992_F4MJgvIVzPZbMywNb3zcBNTw8jkjNbKo.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/75" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[#bd9245] font-bold uppercase tracking-[0.3em] text-sm mb-6">Legal</p>
            <h1 className="page-hero-title mb-6 text-white">Terms & Conditions</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed">
              {TERMS_PAGE_TITLE}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-500 mb-10 leading-relaxed">
              Please read these terms carefully before making an enquiry or booking. By using Explore360
              services, you agree to be bound by the terms below.
            </p>

            <div className="space-y-10">
              {TERMS_SECTIONS.map((section, index) => (
                <article key={section.title} id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                  <h2 className="text-xl md:text-2xl font-black text-[#1e1f44] tracking-tight mb-4">
                    <span className="text-[#bd9245] mr-2">{String(index + 1).padStart(2, '0')}.</span>
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)} className="text-gray-600 leading-relaxed text-[15px] md:text-base">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets?.length ? (
                      <ul className="mt-2 space-y-2 pl-1">
                        {section.bullets.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-gray-600 text-[15px] md:text-base leading-relaxed">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#bd9245]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-14 rounded-2xl border border-gray-100 bg-[#faf8f3] p-6 md:p-8">
              <h3 className="text-lg font-black text-[#1e1f44] mb-3">Need clarification?</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                For questions about these Terms & Conditions, contact Explore360:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm font-semibold">
                <a href={CONTACT_EMAIL_MAILTO} className="text-[#bd9245] hover:underline">
                  {CONTACT_EMAIL}
                </a>
                <a href={CONTACT_PHONE_TEL} className="text-[#bd9245] hover:underline">
                  {CONTACT_PHONE}
                </a>
                <Link href="/contact" className="text-[#1e1f44] hover:text-[#bd9245] transition-colors">
                  Contact page →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
