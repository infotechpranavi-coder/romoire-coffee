import nodemailer from 'nodemailer';

const DEFAULT_RECIPIENTS = [
  'support@romoire.com',
  'ghodehimanshu453@gmail.com'
];

/**
 * Send an email notification whenever a new contact inquiry is submitted.
 * Dispatches to both support@romoire.com and ghodehimanshu453@gmail.com.
 */
export async function sendEnquiryNotificationEmail(data) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn(
      '[Mailer] SMTP credentials not configured in environment variables (SMTP_USER/SMTP_PASS or GMAIL_USER/GMAIL_APP_PASSWORD). Email notification skipped for inquiry from:',
      data.email
    );
    return { success: false, reason: 'SMTP credentials missing' };
  }

  const transporter = nodemailer.createTransport(
    process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
      ? {
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        }
      : {
          host: host || 'smtp.gmail.com',
          port: port,
          secure: port === 465,
          auth: { user, pass },
        }
  );

  const recipients = process.env.CONTACT_NOTIFICATION_EMAILS
    ? process.env.CONTACT_NOTIFICATION_EMAILS.split(',').map((e) => e.trim()).filter(Boolean)
    : DEFAULT_RECIPIENTS;

  const subject = `[Romoire] New Inquiry: ${data.subject || 'General Inquiry'} - ${data.name}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Romoire Contact Inquiry</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #FFF2DE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2E211C;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(102, 24, 24, 0.08);">
        
        <!-- Header -->
        <div style="background-color: #661818; padding: 28px 24px; text-align: center;">
          <h1 style="margin: 0; color: #FFF2DE; font-size: 26px; font-weight: 700; letter-spacing: 2px;">ROMOIRE</h1>
          <p style="margin: 6px 0 0; color: #F7E8D2; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;">New Website Inquiry</p>
        </div>

        <!-- Body -->
        <div style="padding: 30px 24px;">
          <h2 style="margin: 0 0 18px; color: #661818; font-size: 18px; border-bottom: 2px solid #FFF2DE; padding-bottom: 8px;">
            Inquiry Details
          </h2>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f2e9de; color: #7A5C4E; font-weight: 600; width: 140px;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f2e9de; color: #2E211C; font-weight: 600;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f2e9de; color: #7A5C4E; font-weight: 600;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f2e9de;">
                <a href="mailto:${data.email}" style="color: #661818; text-decoration: underline;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f2e9de; color: #7A5C4E; font-weight: 600;">Phone:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f2e9de; color: #2E211C;">
                ${data.phone ? `<a href="tel:${data.phone}" style="color: #661818; text-decoration: none;">${data.phone}</a>` : '<span style="color: #999;">Not provided</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f2e9de; color: #7A5C4E; font-weight: 600;">Topic:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f2e9de; color: #661818; font-weight: 600;">
                ${data.subject || 'General Inquiry'}
              </td>
            </tr>
            ${
              data.orderNumber
                ? `<tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f2e9de; color: #7A5C4E; font-weight: 600;">Order Number:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f2e9de; color: #2E211C; font-weight: 600;">
                ${data.orderNumber}
              </td>
            </tr>`
                : ''
            }
          </table>

          <h3 style="margin: 0 0 10px; color: #661818; font-size: 15px;">Message:</h3>
          <div style="background-color: #FFF9F0; border-left: 4px solid #661818; padding: 16px; border-radius: 4px; color: #2E211C; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">
${data.message || 'No additional message provided.'}
          </div>

          <div style="margin-top: 26px; text-align: center;">
            <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || 'Your Romoire Inquiry')}" style="display: inline-block; background-color: #661818; color: #FFF2DE; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: 600; font-size: 14px;">
              Reply to ${data.name}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #FAF2E6; padding: 16px 24px; text-align: center; font-size: 12px; color: #7A5C4E; border-top: 1px solid #F0E6DA;">
          This email was generated from the Romoire contact form and sent to:<br>
          <strong>support@romoire.com</strong> &bull; <strong>ghodehimanshu453@gmail.com</strong>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"${data.name} (Romoire Website)" <${user}>`,
    to: recipients,
    replyTo: data.email,
    subject,
    text: `New Romoire Website Inquiry\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nTopic: ${data.subject || 'General Inquiry'}\nOrder Number: ${data.orderNumber || 'N/A'}\n\nMessage:\n${data.message || ''}`,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Mailer] Email sent successfully:', info.messageId, 'to', recipients);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Mailer] Error sending email notification:', err);
    return { success: false, error: err.message };
  }
}
