require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

/**
 * Creates Nodemailer transporter using .env SMTP configuration
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const isPort465 = port === 465;

  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: isPort465,
    requireTLS: !isPort465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Status endpoint to check if SMTP settings are populated
 */
app.get('/api/status', (req, res) => {
  const configured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  res.json({
    status: 'ok',
    smtpConfigured: configured,
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '465',
    receiver: process.env.RECEIVE_EMAIL || process.env.SMTP_USER || '(not set)',
  });
});

/**
 * POST /api/contact - Receive form submission and deliver via Gmail SMTP
 */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, product, message } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both your name and email address.',
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    // Check if SMTP credentials exist in .env
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ [SMTP] Form submitted, but SMTP_USER or SMTP_PASS is missing in .env');
      return res.status(500).json({
        success: false,
        error: 'SMTP credentials not configured. Please fill in SMTP_USER and SMTP_PASS in .env.',
      });
    }

    const recipient = process.env.RECEIVE_EMAIL || process.env.SMTP_USER;
    const fromAddress = process.env.SMTP_FROM || `"Neural Genesis Website" <${process.env.SMTP_USER}>`;
    const productName = product ? product.toUpperCase() : 'GENERAL INQUIRY';

    const mailOptions = {
      from: fromAddress,
      to: recipient,
      replyTo: `"${name}" <${email}>`,
      subject: `[Neural Genesis] New Inquiry: ${productName} - ${name}`,
      text: `
New website inquiry received from Neural Genesis contact form:

Name: ${name}
Work Email: ${email}
Primary Interest: ${product || 'Not specified'}
Message: ${message || 'No additional message provided.'}

Date: ${new Date().toLocaleString()}
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; color: #1E293B; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #062D63; padding: 24px 28px; color: #FFFFFF; }
    .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 0; font-size: 13px; color: #93C5FD; }
    .content { padding: 28px; }
    .field { margin-bottom: 18px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 4px; }
    .value { font-size: 15px; color: #0F172A; font-weight: 500; }
    .badge { display: inline-block; background: #E0F2FE; color: #0284C7; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 99px; }
    .footer { background: #F1F5F9; padding: 14px 28px; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Neural Genesis &mdash; New Lead</h2>
      <p>A visitor submitted the demo / contact form on your website.</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Full Name</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="label">Work Email</div>
        <div class="value"><a href="mailto:${escapeHtml(email)}" style="color: #0284C7; text-decoration: none;">${escapeHtml(email)}</a></div>
      </div>
      <div class="field">
        <div class="label">Product / Interest</div>
        <div class="value"><span class="badge">${escapeHtml(productName)}</span></div>
      </div>
      ${message ? `
      <div class="field">
        <div class="label">Additional Notes</div>
        <div class="value" style="white-space: pre-wrap; background: #F8FAFC; padding: 12px; border-radius: 6px; border: 1px solid #E2E8F0;">${escapeHtml(message)}</div>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      Received on ${new Date().toLocaleString()} &bull; Reply directly to this email to contact ${escapeHtml(name)}.
    </div>
  </div>
</body>
</html>
      `,
    };

    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [SMTP] Email sent successfully to ${recipient}: ${info.messageId}`);

    return res.json({
      success: true,
      message: 'Thank you! Your request has been received. Our team will contact you shortly.',
    });
  } catch (error) {
    console.error('❌ [SMTP] Error sending email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email. Please check your SMTP settings in .env.',
    });
  }
});

// Helper function to escape HTML special characters
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Fallback to index.html for single-page routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Neural Genesis Web Server running on http://localhost:${PORT}`);
  console.log(`📧 SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}:${process.env.SMTP_PORT || '465'}`);
  console.log(`👤 SMTP User: ${process.env.SMTP_USER || '(not configured in .env yet)'}`);
  console.log(`📬 Deliver to: ${process.env.RECEIVE_EMAIL || process.env.SMTP_USER || '(not set)'}`);
  console.log(`======================================================\n`);
});
