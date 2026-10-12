'use client'

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users } from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { SITE_NAME, CONTACT_EMAIL, CONTACT_SUPPORT_EMAIL, CONTACT_PHONE } from "@/lib/branding";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    orderNumber: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.about || !formData.message.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const messageLines = [
      `Topic: ${formData.about}`,
      formData.orderNumber.trim() ? `Order Number: ${formData.orderNumber.trim()}` : '',
      formData.message.trim()
    ].filter(Boolean).join('\n\n');

    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.about,
          message: messageLines,
          orderNumber: formData.orderNumber.trim(),
        }),
      });

      const waText = encodeURIComponent(
        `Hi Romoire,\n\nName: ${formData.name.trim()}\nEmail: ${formData.email.trim()}${formData.phone.trim() ? `\nPhone: ${formData.phone.trim()}` : ''}\nWhat's this about: ${formData.about}${formData.orderNumber.trim() ? `\nOrder Number: ${formData.orderNumber.trim()}` : ''}\n\nMessage:\n${formData.message.trim()}`
      );
      window.open(`https://wa.me/918369669275?text=${waText}`, '_blank');

      alert("Thank you! Your message has been sent.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        about: "",
        orderNumber: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      const waText = encodeURIComponent(
        `Hi Romoire,\n\nName: ${formData.name.trim()}\nEmail: ${formData.email.trim()}${formData.phone.trim() ? `\nPhone: ${formData.phone.trim()}` : ''}${formData.about ? `\nWhat's this about: ${formData.about}` : ''}${formData.orderNumber.trim() ? `\nOrder Number: ${formData.orderNumber.trim()}` : ''}\n\nMessage:\n${formData.message.trim()}`
      );
      window.open(`https://wa.me/918369669275?text=${waText}`, '_blank');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["based in Mumbai"],
      description: ""
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["+918369669275"],
      description: "available on whatsapp"
    },
    {
      icon: Mail,
      title: "Email Address",
      details: [CONTACT_EMAIL, CONTACT_SUPPORT_EMAIL],
      description: "We respond within 24 hours"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 9:00 AM - 4:00 PM"],
      description: "Sunday: Closed"
    }
  ];

  const teamMembers = [
    {
      name: "Customer Support",
      role: "Orders & Help",
      email: CONTACT_SUPPORT_EMAIL,
      phone: CONTACT_PHONE
    },
    {
      name: `${SITE_NAME} Team`,
      role: "General Inquiries",
      email: CONTACT_EMAIL,
      phone: CONTACT_PHONE
    }
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative text-white min-h-[460px] md:min-h-[560px] lg:min-h-[620px] py-32 md:py-44 lg:py-52 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/image%202.jpg')` }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-[1000] leading-none tracking-tight uppercase">
              Contact Us
            </h1>
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-espresso mb-6">
                  Send us a Message via WhatsApp
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone (optional)
                          </label>
                          <div className="phone-input-container">
                            <PhoneInput
                              country={'in'}
                              value={formData.phone}
                              onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                              inputProps={{
                                name: 'phone',
                                id: 'phone',
                                required: false,
                              }}
                              containerClass="!w-full"
                              inputClass="!w-full !h-[40px] !px-3 !py-2 !pl-[48px] !border !border-gray-200 !rounded-md focus:!ring-2 focus:!ring-black focus:!border-transparent !transition-all text-sm"
                              buttonClass="!bg-cream !border !border-gray-200 !border-r-0 !rounded-l-md hover:!bg-gray-50"
                            />
                            <style jsx global>{`
                              .phone-input-container .react-tel-input .selected-flag {
                                background: transparent !important;
                                padding-left: 10px !important;
                                width: 44px !important;
                              }
                              .phone-input-container .react-tel-input .flag-dropdown {
                                background: transparent !important;
                                border: 1px solid #e5e7eb !important;
                                border-right: none !important;
                                border-top-left-radius: 0.375rem !important;
                                border-bottom-left-radius: 0.375rem !important;
                              }
                            `}</style>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
                            What’s this about? *
                          </label>
                          <Select
                            value={formData.about}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, about: val }))}
                            required
                          >
                            <SelectTrigger id="about" className="bg-white">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="Order or delivery">Order or delivery</SelectItem>
                              <SelectItem value="Product question">Product question</SelectItem>
                              <SelectItem value="Feedback">Feedback</SelectItem>
                              <SelectItem value="Bulk or corporate gifting">Bulk or corporate gifting</SelectItem>
                              <SelectItem value="Stockist or retail enquiry">Stockist or retail enquiry</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          Order number (optional)
                        </label>
                        <Input
                          id="orderNumber"
                          name="orderNumber"
                          type="text"
                          value={formData.orderNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. ROM-1234"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="How can we help you?"
                          rows={4}
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-[#1b7a43] hover:bg-[#156336] text-white font-medium shadow-sm transition-colors"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Send Message via WhatsApp
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Team Info */}
              <div className="space-y-8">

                {/* Team Members */}
                <div>
                  <h2 className="text-3xl font-bold text-espresso mb-6">
                    Our Team
                  </h2>
                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-espresso">{member.name}</h3>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <a href={`mailto:${member.email}`} className="text-xs text-primary hover:underline">
                                  {member.email}
                                </a>
                                <a href={`tel:${member.phone}`} className="text-xs text-primary hover:underline">
                                  {member.phone}
                                </a>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-espresso mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We usually respond within 24 hours
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <info.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-espresso mb-3">
                      {info.title}
                    </h3>
                    <div className="space-y-1 mb-3">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 font-medium">
                          {detail.includes('@') ? (
                            <a href={`mailto:${detail}`} className="hover:text-primary hover:underline">
                              {detail}
                            </a>
                          ) : detail.startsWith('+') ? (
                            <a href={`tel:${detail}`} className="hover:text-primary hover:underline">
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      ))}
                    </div>
                    {info.description && (
                      <p className="text-sm text-gray-500">
                        {info.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

const ContactPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mr-2"></div></div>}>
      <ContactForm />
    </Suspense>
  );
};

export default ContactPage;

