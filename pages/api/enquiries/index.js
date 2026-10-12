import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { isConnected } from '@/lib/mongodb';
import { sendEnquiryNotificationEmail } from '@/lib/mailer';

function buildEnquiryMessage(body) {
  if (body.message?.trim()) return body.message.trim();

  const parts = [
    body.subject?.trim() && `Subject: ${body.subject.trim()}`,
    body.destination?.trim() && `Destination: ${body.destination.trim()}`,
    body.travelDate?.trim() && `Travel date: ${body.travelDate.trim()}`,
    body.travelers?.trim() && `Travelers: ${body.travelers.trim()}`,
    body.budget?.trim() && `Budget: ${body.budget.trim()}`,
    body.packageName?.trim() && `Package: ${body.packageName.trim()}`,
    body.packageType?.trim() && `Package type: ${body.packageType.trim()}`,
    body.packageDuration?.trim() && `Category ref: ${body.packageDuration.trim()}`,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join('\n') : 'Contact form inquiry';
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    if (!isConnected()) {
      return res.status(200).json({ success: true, data: [] });
    }
    try {
      const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: enquiries });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database not available. Please try again later or contact us by phone.',
      });
    }
    try {
      const payload = {
        ...req.body,
        name: req.body.name?.trim(),
        email: req.body.email?.trim(),
        phone: req.body.phone?.trim() || '',
        subject: req.body.subject?.trim() || 'General Inquiry',
        message: buildEnquiryMessage(req.body),
        destination: req.body.destination?.trim() || '',
        travelDate: req.body.travelDate?.trim() || '',
        travelers: req.body.travelers?.trim() || '',
        budget: req.body.budget?.trim() || '',
        packageType: req.body.packageType?.trim() || '',
        packageName: req.body.packageName?.trim() || '',
        packageDuration: req.body.packageDuration?.trim() || '',
        status: 'new',
      };

      if (!payload.name || !payload.email) {
        return res.status(400).json({ success: false, error: 'Name and email are required.' });
      }

      const enquiry = await Enquiry.create(payload);

      // Asynchronously dispatch email notification to support@romoire.com & ghodehimanshu453@gmail.com
      sendEnquiryNotificationEmail({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        subject: payload.subject,
        message: payload.message,
        orderNumber: req.body.orderNumber,
      }).catch((mailErr) => {
        console.error('[Enquiry API] Failed to send email notification:', mailErr);
      });

      res.status(201).json({ success: true, data: enquiry });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
