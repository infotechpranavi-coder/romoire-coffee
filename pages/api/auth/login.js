export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@skygo.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'skygo@admin2025';

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const emailMatch = String(email).trim().toLowerCase() === adminEmail.trim().toLowerCase();
  const passwordMatch = String(password) === adminPassword;

  if (!emailMatch || !passwordMatch) {
    return res.status(401).json({ success: false, error: 'Invalid email or password. Please try again.' });
  }

  const expires = new Date();
  expires.setHours(expires.getHours() + 24);

  res.setHeader(
    'Set-Cookie',
    `admin_session=authenticated; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`
  );

  return res.status(200).json({ success: true });
}
