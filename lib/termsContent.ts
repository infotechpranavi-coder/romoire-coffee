export type TermsSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export const TERMS_PAGE_TITLE = 'Explore360 – Terms of Use, Disclaimer & Limitation of Liability';

export const TERMS_SECTIONS: TermsSection[] = [
  {
    title: 'Acceptance of Terms',
    paragraphs: [
      'By accessing the Explore360 website or promotions across any platform or media, by contacting us through any medium, requesting information, making an enquiry, making a payment or booking any experience through Explore360, you acknowledge that you have read, understood and agreed to be bound by these Terms & Conditions, Disclaimer, Privacy Policy and any activity-specific terms communicated to you.',
      'If you do not agree with these terms, you should not proceed with any booking or use of our services.',
    ],
  },
  {
    title: 'Eligibility',
    paragraphs: [
      'By using our website or booking any experience through Explore360, you represent that you are at least 18 years of age or are booking under the supervision and consent of a parent or legal guardian. You further confirm that you have the legal capacity to enter into a binding agreement under the applicable laws of India.',
    ],
  },
  {
    title: 'Accuracy of Information',
    paragraphs: [
      'You agree to provide complete, accurate and up-to-date information while making enquiries or bookings. Explore360 shall not be responsible for any loss, delay or inconvenience arising from incorrect, incomplete or misleading information provided by you.',
    ],
  },
  {
    title: 'User Responsibilities',
    paragraphs: [
      'You agree to comply with all applicable laws, regulations, safety instructions and operational guidelines issued by Explore360 and the respective service provider. You shall conduct yourself responsibly throughout the experience and shall not engage in any unlawful, unsafe or disruptive behaviour that may endanger yourself, other participants or service providers.',
    ],
  },
  {
    title: 'Health & Fitness Declaration',
    paragraphs: [
      'You are solely responsible for assessing your physical and medical fitness before participating in any activity. You must disclose any relevant medical conditions, disabilities or special requirements that may affect your participation. Explore360 and its service providers reserve the right to refuse participation if an activity is considered unsafe for you or others.',
    ],
  },
  {
    title: 'Nature of Our Services',
    paragraphs: [
      'Explore360 is an adventure, travel and experiences platform that curates, promotes, coordinates and facilitates bookings for experiences offered by independent third-party operators and service providers.',
      'Unless expressly stated otherwise, Explore360 does not own, operate, manage or control the boats, yachts, aircraft, helicopters, vehicles, camps, hotels, adventure equipment, activities or destinations offered through our platform. We act solely as an organiser, facilitator, booking partner and intermediary between customers and independent service providers.',
    ],
  },
  {
    title: 'Responsibility of Service Providers',
    paragraphs: [
      'All adventure activities, travel services, accommodation, transportation, equipment, guides, instructors and operational services are provided, managed and controlled solely by the respective service providers.',
      'Each service provider is independently responsible for:',
    ],
    bullets: [
      'Safety standards, Licences and statutory approvals',
      'Equipment maintenance & Operational procedures',
      'Qualified personnel',
      'Insurance (where applicable) & Compliance with applicable laws and regulations',
    ],
  },
  {
    title: 'Independent Contractor Relationship',
    paragraphs: [
      'All service providers listed or promoted by Explore360 operate as independent contractors. Nothing contained in these Terms shall be construed as creating any partnership, joint venture, agency, employment or franchise relationship between Explore360 and any service provider. Explore360 acts solely as a booking facilitator and coordinator and is not responsible for the day-to-day operation or execution of the services provided by independent operators.',
    ],
  },
  {
    title: 'Assumption of Risk',
    paragraphs: [
      'Adventure sports, outdoor activities and travel involve inherent risks including, but not limited to, injury, illness, disability, property damage, delays, weather-related disruptions and in rare cases, death.',
      'By participating, you voluntarily assume these inherent risks and confirm that you are physically and medically fit to undertake the chosen activity. You agree to follow all safety instructions issued by the activity operator.',
    ],
  },
  {
    title: 'Pricing & Availability',
    paragraphs: [
      'All prices, itineraries, schedules, availability and inclusions are subject to change without prior notice until a booking has been confirmed. Explore360 does not guarantee the availability of any experience until confirmed by the respective service provider.',
    ],
  },
  {
    title: 'Bookings, Payments & Cancellations',
    paragraphs: [
      'Bookings are subject to availability and confirmation by the respective service provider. Cancellation, refund, rescheduling and payment policies may vary between activities and operators and will be communicated at the time of booking. Explore360 reserves the right to cancel or modify bookings where necessary due to operational, safety or unforeseen circumstances.',
    ],
  },
  {
    title: 'Force Majeure',
    paragraphs: [
      'Explore360 shall not be liable for any delay, modification, cancellation or failure to perform arising from events beyond its reasonable control, including but not limited to adverse weather conditions, natural disasters, government restrictions, civil unrest, strikes, pandemics, technical failures or any other force majeure event.',
    ],
  },
  {
    title: 'Limitation of Liability',
    paragraphs: [
      'To the fullest extent permitted by applicable law, Explore360 shall not be liable for any injury, accident, illness, death, loss, theft, damage, delay, cancellation, schedule change, weather disruption, force majeure event or any direct, indirect or consequential loss arising from or connected with any activity or service provided by an independent third-party operator.',
      'Any claims relating to the conduct, safety, operation or quality of an activity shall be addressed directly with the respective service provider responsible for delivering that experience.',
    ],
  },
  {
    title: 'Indemnity',
    paragraphs: [
      "You agree to indemnify and hold harmless Explore360, its founders, employees, representatives and affiliates from any claims, liabilities, losses, damages, costs or expenses arising out of your participation in any activity, your breach of these Terms, or your failure to comply with the instructions, policies or safety requirements of the relevant service provider, except where such liability arises from Explore360's own gross negligence or wilful misconduct.",
    ],
  },
  {
    title: 'Changes to Itinerary',
    paragraphs: [
      'Adventure travel is dynamic in nature. Routes, schedules, accommodations, activities or itineraries may be modified due to weather, government restrictions, safety concerns, operational requirements or circumstances beyond reasonable control. Such changes shall not constitute a breach of contract.',
    ],
  },
  {
    title: 'Intellectual Property',
    paragraphs: [
      'All content available on the Explore360 website, including text, logos, graphics, photographs, videos, designs, trademarks and other materials, are the intellectual property of Explore360 or their respective owners and may not be copied, reproduced, modified or used without prior written permission.',
    ],
  },
  {
    title: 'Third-Party Websites & Services',
    paragraphs: [
      'The Explore360 website may contain links to third-party websites or services for your convenience. Explore360 does not control, endorse or assume responsibility for the content, policies, products or services of any third-party website or operator.',
    ],
  },
  {
    title: 'Right to Refuse Service',
    paragraphs: [
      'Explore360 reserves the right to decline or cancel any enquiry or booking, refuse participation, suspend or terminate access to its services where required for safety, operational, legal or commercial reasons, or where a customer is found to be in breach of these Terms & Conditions.',
    ],
  },
  {
    title: 'Amendments',
    paragraphs: [
      'Explore360 reserves the right to update or modify these Terms & Conditions, Disclaimer and related policies at any time without prior notice. The revised version shall become effective immediately upon publication on the website. Continued use of our website or services constitutes acceptance of the updated terms.',
    ],
  },
  {
    title: 'Privacy',
    paragraphs: [
      'Any personal information collected by Explore360 shall be processed in accordance with our Privacy Policy and applicable laws. By using our services, you consent to the collection, storage and use of your information for the purpose of processing enquiries, bookings and customer support.',
    ],
  },
  {
    title: 'Severability',
    paragraphs: [
      'If any provision of these Terms & Conditions is held to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue to remain valid and enforceable.',
    ],
  },
  {
    title: 'Entire Agreement',
    paragraphs: [
      'These Terms & Conditions, together with our Disclaimer, Privacy Policy, Cancellation & Refund Policy and any activity-specific instructions or waivers, constitute the complete agreement between you and Explore360 with respect to your use of our website and services.',
    ],
  },
  {
    title: 'Governing Law',
    paragraphs: [
      'These Terms & Conditions shall be governed by the laws of India. Any dispute arising from the use of this website or our services shall be subject to the exclusive jurisdiction of the courts at Mumbai, Maharashtra.',
    ],
  },
  {
    title: 'Contact',
    paragraphs: [
      'For any questions relating to these Terms & Conditions, please contact Explore360 through the contact details provided on our website.',
    ],
  },
];
