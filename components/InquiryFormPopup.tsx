import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Phone, Mail, MapPin, Calendar, Users, Plane } from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { ProductInfo } from "../contexts/InquiryFormContext";
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_SUPPORT_EMAIL, CONTACT_PHONE } from "@/lib/branding";

interface InquiryFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  productInfo?: ProductInfo;
}

const InquiryFormPopup = ({ isOpen, onClose, productInfo }: InquiryFormPopupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelDate: "",
    travelers: "",
    budget: "",
    message: ""
  });

  const [availablePackages, setAvailablePackages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        if (data.success) {
          setAvailablePackages(data.data);
        }
      } catch (error) {
        console.error("Error fetching packages for inquiry form:", error);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (isOpen && productInfo && productInfo.type !== 'General') {
      setFormData(prev => ({
        ...prev,
        destination: "other", // Default to other since you have a fixed list, or they can change it
        message: `I am interested in the ${productInfo.type}: ${productInfo.title}. Please provide me with more details.`
      }));
    } else if (isOpen) {
      // Reset if opened in general mode
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "",
        travelDate: "",
        travelers: "",
        budget: "",
        message: ""
      });
    }
  }, [isOpen, productInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const message =
        formData.message.trim() ||
        (productInfo && productInfo.type !== 'General'
          ? `I am interested in the ${productInfo.type}: ${productInfo.title}. Please provide me with more details.`
          : '') ||
        [
          formData.destination && `Destination: ${formData.destination}`,
          formData.travelDate && `Delivery date: ${formData.travelDate}`,
          formData.travelers && `Quantity: ${formData.travelers}`,
          formData.budget && `Budget: ${formData.budget}`,
        ]
          .filter(Boolean)
          .join('\n') ||
        'General inquiry';

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        packageType: productInfo?.category || (productInfo && productInfo.type !== 'General' ? productInfo.type : ''),
        packageName: productInfo?.title || '',
        packageDuration: productInfo?.duration || '',
        subject: productInfo && productInfo.type !== 'General'
          ? `Inquiry for ${productInfo.type}: ${productInfo.title}`
          : 'General Inquiry',
        destination: formData.destination,
        travelDate: formData.travelDate,
        travelers: formData.travelers,
        budget: formData.budget,
        message,
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      alert("Thank you for your inquiry! Our experts will get in touch with you shortly.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "",
        travelDate: "",
        travelers: "",
        budget: "",
        message: ""
      });

      onClose();
    } catch (error) {
      console.error("Error sending inquiry:", error);
      alert("There was an error sending your inquiry. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-cream rounded-2xl shadow-2xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary to-primary text-white p-3 sm:p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-200 transition-colors p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="text-center pr-8 sm:pr-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
              {productInfo && productInfo.type !== 'General' ? `Order ${productInfo.title}` : 'Place Your Coffee Order'}
            </h2>
            <p className="text-sm sm:text-base md:text-lg opacity-90">
              {productInfo && productInfo.type !== 'General' ? `Tell us how you'd like this coffee prepared and delivered` : 'Get personalized coffee recommendations from our roasting team'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-3 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-6">
            <div className="grid md:grid-cols-2 gap-1 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full max-w-xs sm:max-w-none px-2 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-xs sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full max-w-xs sm:max-w-none px-2 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-xs sm:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-1 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Phone Number *
                </label>
                <div className="phone-input-container">
                  <PhoneInput
                    country={'za'}
                    value={formData.phone}
                    onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                    inputProps={{
                      name: 'phone',
                      required: true,
                    }}
                    containerClass="!w-full"
                    inputClass="!w-full !h-[38px] sm:!h-[48px] !px-2 sm:!px-4 !py-1.5 sm:!py-3 !pl-[48px] sm:!pl-[58px] !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-secondary focus:!border-transparent !transition-all !text-xs sm:!text-base"
                    buttonClass="!bg-cream !border !border-gray-300 !border-r-0 !rounded-l-lg hover:!bg-gray-50"
                  />
                  <style jsx global>{`
                    .phone-input-container .react-tel-input .selected-flag {
                      background: transparent !important;
                      padding-left: 12px !important;
                      width: 44px !important;
                    }
                    .phone-input-container .react-tel-input .flag-dropdown {
                      background: transparent !important;
                      border: 1px solid #d1d5db !important;
                      border-right: none !important;
                      border-top-left-radius: 0.5rem !important;
                      border-bottom-left-radius: 0.5rem !important;
                    }
                    @media (max-width: 640px) {
                      .phone-input-container .react-tel-input .selected-flag {
                        padding-left: 8px !important;
                        width: 38px !important;
                      }
                    }
                  `}</style>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Coffee / Product *
                </label>
                <div className="relative">
                  <input
                    list="package-destinations"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                    className="w-full max-w-xs sm:max-w-none px-2 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-xs sm:text-base"
                    placeholder="Enter or select coffee"
                  />
                  <datalist id="package-destinations">
                    {availablePackages.map((pkg) => (
                      <option key={pkg._id} value={pkg.title}>{pkg.location}</option>
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-1 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Preferred Delivery Date *
                </label>
                <input
                  type="date"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleInputChange}
                  required
                  className="w-full max-w-xs sm:max-w-none px-2 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-xs sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Quantity (bags) *
                </label>
                <select
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  required
                  className="w-full max-w-xs sm:max-w-none px-2 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-xs sm:text-base"
                >
                  <option value="">Select quantity</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3">3 People</option>
                  <option value="4">4 People</option>
                  <option value="5+">5+ People</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full max-w-xs sm:max-w-none px-2 sm:px-4 py-1.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-xs sm:text-base"
                placeholder="Enter your budget range "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full max-w-xs sm:max-w-none px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="Tell us your grind preference (whole bean / ground), brew method, or any special requests..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-secondary hover:bg-secondary/90 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all disabled:opacity-50 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Plane className="mr-2 h-5 w-5" />
                    Send Inquiry
                  </div>
                )}
              </Button>

              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">Need immediate assistance?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="flex flex-col items-center">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">Call us</p>
                <p className="font-semibold text-secondary text-sm sm:text-base">{CONTACT_PHONE}</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">Email us</p>
                <p className="font-semibold text-secondary text-sm sm:text-base">{CONTACT_EMAIL}</p>
                <p className="font-semibold text-secondary text-sm sm:text-base">{CONTACT_SUPPORT_EMAIL}</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">Visit us</p>
                <p className="font-semibold text-secondary text-xs sm:text-sm">{CONTACT_ADDRESS}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryFormPopup;
