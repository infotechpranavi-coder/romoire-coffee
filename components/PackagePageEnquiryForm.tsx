'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PackagePageEnquiryFormProps {
  categoryLabel: string;
  categorySlug?: string;
  packageName?: string;
}

export default function PackagePageEnquiryForm({
  categoryLabel,
  categorySlug,
  packageName,
}: PackagePageEnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelDate: '',
    travelers: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const subject = packageName
        ? `Inquiry for Package: ${packageName}`
        : `Inquiry for ${categoryLabel}`;

      const message =
        formData.message.trim() ||
        [
          packageName && `Package: ${packageName}`,
          `Experience category: ${categoryLabel}`,
          formData.travelDate && `Travel date: ${formData.travelDate}`,
          formData.travelers && `Travelers: ${formData.travelers}`,
        ]
          .filter(Boolean)
          .join('\n');

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          packageType: categoryLabel,
          packageName: packageName || categoryLabel,
          packageDuration: categorySlug || '',
          subject,
          travelDate: formData.travelDate,
          travelers: formData.travelers,
          message,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to submit enquiry');

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        travelDate: '',
        travelers: '',
        message: '',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[32px] bg-cream border border-green-100 p-10 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-7 w-7 text-green-600" />
        </div>
        <h3 className="text-xl font-black text-espresso uppercase tracking-tight mb-2">Enquiry Sent</h3>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Thank you! Our team will contact you shortly about {packageName || categoryLabel}.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-xl"
          onClick={() => setSubmitted(false)}
        >
          Send Another Enquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] bg-cream border border-gray-100 p-8 md:p-10 shadow-sm">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-hazelnut mb-2">Get a Quote</p>
        <h3 className="text-2xl md:text-3xl font-black text-espresso uppercase tracking-tight">
          Enquire About {packageName || categoryLabel}
        </h3>
        <p className="text-gray-500 text-sm mt-2">
          No fixed prices online — tell us what you need and we&apos;ll send a tailored quote.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <Input
          required
          placeholder="Your name *"
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          className="h-12 rounded-xl"
        />
        <Input
          required
          type="email"
          placeholder="Email address *"
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          className="h-12 rounded-xl"
        />
        <div className="md:col-span-2">
          <PhoneInput
            country="za"
            value={formData.phone}
            onChange={(phone) => setFormData((p) => ({ ...p, phone }))}
            inputClass="!w-full !h-12 !rounded-xl !text-sm"
            containerClass="!w-full"
            buttonClass="!rounded-l-xl"
          />
        </div>
        <Input
          type="date"
          placeholder="Travel date"
          value={formData.travelDate}
          onChange={(e) => setFormData((p) => ({ ...p, travelDate: e.target.value }))}
          className="h-12 rounded-xl"
        />
        <Input
          placeholder="Number of travelers"
          value={formData.travelers}
          onChange={(e) => setFormData((p) => ({ ...p, travelers: e.target.value }))}
          className="h-12 rounded-xl"
        />
        <Textarea
          placeholder={`Tell us about your ${categoryLabel.toLowerCase()} plans...`}
          value={formData.message}
          onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
          className="md:col-span-2 min-h-[120px] rounded-xl resize-none"
        />
        {error && (
          <p className="md:col-span-2 text-red-500 text-sm font-semibold text-center">{error}</p>
        )}
        <div className="md:col-span-2 flex justify-center pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-espresso hover:bg-hazelnut text-white font-black uppercase tracking-widest text-xs px-10 h-12 rounded-xl"
          >
            {isSubmitting ? 'Sending...' : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Enquiry
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
