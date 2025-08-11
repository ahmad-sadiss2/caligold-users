// lib/email.ts - Email notification service for CALI GOLD DRIVE
import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'arjaahmad782@gmail.com',
    pass: process.env.EMAIL_PASS || '', // App password needed for Gmail
  }
};

// Notification recipients
const NOTIFICATION_EMAILS = [
  'Caligolddrive@gmail.com',
  'Yazan.zyoudy7@gmail.com'
];

// Create transporter
const createTransporter = () => {
  try {
    return nodemailer.createTransport(EMAIL_CONFIG);
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    return null;
  }
};

// Format booking data for email
export interface BookingEmailData {
  id?: number;
  booking_reference?: string;
  customer_id?: number;
  service_id?: number;
  vehicle_id: number;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  return_datetime?: string;
  passenger_count: number;
  is_round_trip: boolean;
  special_requests?: string;
  estimated_price?: number;
  final_price: number;
  status: string;
  payment_status: string;
  driver_notes?: string;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
  pickup_details?: string;
  dropoff_details?: string;
  payment_intent_id: string;
  service_type: string;
  duration_hours: number;
  vehicle_name?: string;
}

// Generate professional HTML email template
const generateBookingEmailHTML = (booking: BookingEmailData): string => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Confirmation - CALI GOLD DRIVE</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #FFD700, #FFA500); color: black; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .booking-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-section { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700; }
        .info-section h3 { margin: 0 0 15px; color: #333; font-size: 18px; font-weight: 600; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; }
        .info-label { font-weight: 600; color: #555; }
        .info-value { color: #333; text-align: right; }
        .payment-status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
        .status-completed { background: #d4edda; color: #155724; }
        .highlight { background: linear-gradient(135deg, #FFD700, #FFA500); color: black; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; }
        @media (max-width: 600px) { .booking-info { grid-template-columns: 1fr; } }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🚗 NEW BOOKING CONFIRMED</h1>
          <p>CALI GOLD DRIVE - Premium Transportation Service</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Payment Confirmation -->
          <div class="highlight">
            <h2 style="margin: 0 0 10px;">💳 PAYMENT SUCCESSFUL</h2>
            <p style="margin: 0; font-size: 18px;">Total Amount: <strong>${formatCurrency(booking.final_price)}</strong></p>
            <p style="margin: 5px 0 0; font-size: 14px;">Payment ID: ${booking.payment_intent_id}</p>
          </div>

          <!-- Booking Information Grid -->
          <div class="booking-info">
            <!-- Customer Information -->
            <div class="info-section">
              <h3>👤 Customer Information</h3>
              <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value">${booking.customer_first_name} ${booking.customer_last_name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${booking.customer_email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span class="info-value">${booking.customer_phone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Passengers:</span>
                <span class="info-value">${booking.passenger_count}</span>
              </div>
            </div>

            <!-- Service Details -->
            <div class="info-section">
              <h3>🎯 Service Details</h3>
              <div class="info-row">
                <span class="info-label">Service Type:</span>
                <span class="info-value">${booking.service_type}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Vehicle:</span>
                <span class="info-value">${booking.vehicle_name || `Vehicle ID: ${booking.vehicle_id}`}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Duration:</span>
                <span class="info-value">${booking.duration_hours} hours</span>
              </div>
              <div class="info-row">
                <span class="info-label">Round Trip:</span>
                <span class="info-value">${booking.is_round_trip ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <!-- Pickup Details -->
            <div class="info-section">
              <h3>📍 Pickup Information</h3>
              <div class="info-row">
                <span class="info-label">Location:</span>
                <span class="info-value">${booking.pickup_location}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date & Time:</span>
                <span class="info-value">${formatDate(booking.pickup_datetime)}</span>
              </div>
              ${booking.pickup_details ? `
              <div class="info-row">
                <span class="info-label">Details:</span>
                <span class="info-value">${booking.pickup_details}</span>
              </div>
              ` : ''}
            </div>

            <!-- Dropoff Details -->
            <div class="info-section">
              <h3>📍 Dropoff Information</h3>
              <div class="info-row">
                <span class="info-label">Location:</span>
                <span class="info-value">${booking.dropoff_location}</span>
              </div>
              ${booking.return_datetime ? `
              <div class="info-row">
                <span class="info-label">Return Time:</span>
                <span class="info-value">${formatDate(booking.return_datetime)}</span>
              </div>
              ` : ''}
              ${booking.dropoff_details ? `
              <div class="info-row">
                <span class="info-label">Details:</span>
                <span class="info-value">${booking.dropoff_details}</span>
              </div>
              ` : ''}
            </div>

            <!-- Payment & Status -->
            <div class="info-section">
              <h3>💳 Payment & Status</h3>
              <div class="info-row">
                <span class="info-label">Payment Status:</span>
                <span class="info-value">
                  <span class="payment-status status-completed">${booking.payment_status}</span>
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Final Price:</span>
                <span class="info-value"><strong>${formatCurrency(booking.final_price)}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Booking Status:</span>
                <span class="info-value">${booking.status}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Booking Ref:</span>
                <span class="info-value">${booking.booking_reference || booking.id || 'N/A'}</span>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="info-section">
              <h3>📝 Additional Information</h3>
              ${booking.special_requests ? `
              <div class="info-row">
                <span class="info-label">Special Requests:</span>
                <span class="info-value">${booking.special_requests}</span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="info-label">Created:</span>
                <span class="info-value">${booking.created_at ? formatDate(booking.created_at) : 'Just now'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Intent:</span>
                <span class="info-value">${booking.payment_intent_id}</span>
              </div>
            </div>
          </div>

          <!-- Action Required -->
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin-top: 20px;">
            <h3 style="margin: 0 0 10px; color: #1976d2;">🎯 Action Required</h3>
            <p style="margin: 0; color: #333;">
              • Assign driver for this booking<br>
              • Confirm vehicle availability<br>
              • Send service confirmation to customer<br>
              • Update booking status in admin dashboard
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0;"><strong>CALI GOLD DRIVE</strong> - Premium Transportation Service</p>
          <p style="margin: 5px 0 0; font-size: 14px;">This is an automated notification from your booking system.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send booking notification email
export const sendBookingNotification = async (bookingData: BookingEmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('Email transporter not available');
      return false;
    }

    const htmlContent = generateBookingEmailHTML(bookingData);
    
    const mailOptions = {
      from: {
        name: 'CALI GOLD DRIVE Booking System',
        address: EMAIL_CONFIG.auth.user
      },
      to: NOTIFICATION_EMAILS,
      subject: `🚗 NEW BOOKING CONFIRMED - ${bookingData.customer_first_name} ${bookingData.customer_last_name} - ${bookingData.service_type}`,
      html: htmlContent,
      priority: 'high' as const
    };

    console.log('📧 Sending booking notification email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Booking notification email sent successfully:', result.messageId);
    return true;

  } catch (error) {
    console.error('❌ Failed to send booking notification email:', error);
    return false;
  }
};

// Test email configuration
export const testEmailConfiguration = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      return false;
    }

    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;

  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return false;
  }
};

// Contact form email interfaces
export interface ContactFormEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt: string;
  id?: number;
}

// Generate team notification email for contact form
const generateContactFormTeamEmailHTML = (contact: ContactFormEmailData): string => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return dateString;
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission - CALI GOLD DRIVE</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #FFD700, #FFA500); color: black; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .highlight { background: linear-gradient(135deg, #FFD700, #FFA500); color: black; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .info-section { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700; margin-bottom: 20px; }
        .info-section h3 { margin: 0 0 15px; color: #333; font-size: 18px; font-weight: 600; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: 600; color: #555; flex: 0 0 120px; }
        .info-value { color: #333; flex: 1; text-align: right; word-break: break-word; }
        .message-box { background: #fff; border: 2px solid #FFD700; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .message-box h4 { margin: 0 0 15px; color: #333; }
        .message-content { background: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic; color: #555; line-height: 1.8; }
        .action-section { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin-top: 20px; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>📧 NEW CONTACT FORM SUBMISSION</h1>
          <p>CALI GOLD DRIVE - Customer Inquiry</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Priority Alert -->
          <div class="highlight">
            <h2 style="margin: 0 0 10px;">🔔 NEW CUSTOMER INQUIRY</h2>
            <p style="margin: 0; font-size: 18px;"><strong>Subject:</strong> ${contact.subject}</p>
            <p style="margin: 5px 0 0; font-size: 14px;">Submitted: ${formatDate(contact.submittedAt)}</p>
          </div>

          <!-- Customer Information -->
          <div class="info-section">
            <h3>👤 Customer Information</h3>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value"><strong>${contact.name}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value"><a href="mailto:${contact.email}" style="color: #FFD700; text-decoration: none;">${contact.email}</a></span>
            </div>
            ${contact.phone ? `
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value"><a href="tel:${contact.phone}" style="color: #FFD700; text-decoration: none;">${contact.phone}</a></span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="info-label">Subject:</span>
              <span class="info-value">${contact.subject}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Inquiry ID:</span>
              <span class="info-value">#${contact.id || 'N/A'}</span>
            </div>
          </div>

          <!-- Customer Message -->
          <div class="message-box">
            <h4>💬 Customer Message:</h4>
            <div class="message-content">
              "${contact.message}"
            </div>
          </div>

          <!-- Action Required -->
          <div class="action-section">
            <h3 style="margin: 0 0 10px; color: #1976d2;">🎯 Action Required</h3>
            <p style="margin: 0; color: #333;">
              • <strong>Respond within 2 hours</strong> for excellent customer service<br>
              • Review customer message and prepare personalized response<br>
              • Check if this inquiry is related to existing bookings<br>
              • Update customer status in admin dashboard<br>
              • Consider scheduling a follow-up call if needed
            </p>
          </div>

          <!-- Quick Response -->
          <div style="background: #f1f8e9; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin-top: 20px;">
            <h3 style="margin: 0 0 10px; color: #2e7d32;">⚡ Quick Response Options</h3>
            <p style="margin: 0; color: #333;">
              • <strong>Email:</strong> <a href="mailto:${contact.email}?subject=Re: ${contact.subject}" style="color: #4caf50;">Reply directly to customer</a><br>
              ${contact.phone ? `• <strong>Call:</strong> <a href="tel:${contact.phone}" style="color: #4caf50;">Call ${contact.phone}</a><br>` : ''}
              • <strong>Admin:</strong> Log into dashboard to update status<br>
              • <strong>WhatsApp:</strong> Message for immediate response
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0;"><strong>CALI GOLD DRIVE</strong> - Premium Transportation Service</p>
          <p style="margin: 5px 0 0; font-size: 14px;">Respond promptly to maintain our excellent customer service reputation!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate customer confirmation email
const generateContactFormCustomerEmailHTML = (contact: ContactFormEmailData): string => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return dateString;
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You - CALI GOLD DRIVE</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #FFD700, #FFA500); color: black; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .highlight { background: linear-gradient(135deg, #e8f5e8, #c8e6c9); color: #2e7d32; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #4caf50; }
        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700; margin: 20px 0; }
        .message-summary { background: #fff; border: 2px solid #FFD700; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .contact-info { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #FFD700, #FFA500); color: black; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; margin: 10px 5px; transition: transform 0.2s; }
        .cta-button:hover { transform: translateY(-2px); }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>✅ MESSAGE RECEIVED</h1>
          <p>Thank you for contacting CALI GOLD DRIVE</p>
        </div>

        <!-- Content -->
        <div class="content">
          <!-- Confirmation -->
          <div class="highlight">
            <h2 style="margin: 0 0 15px;">🎉 Thank You, ${contact.name}!</h2>
            <p style="margin: 0; font-size: 18px;">We've received your message and will respond within <strong>2 hours</strong>.</p>
          </div>

          <!-- Message Summary -->
          <div class="message-summary">
            <h3 style="margin: 0 0 15px; color: #333;">📋 Your Message Summary</h3>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Submitted:</strong> ${formatDate(contact.submittedAt)}</p>
            <p><strong>Reference ID:</strong> #${contact.id || 'Processing'}</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px;">
              <strong>Your Message:</strong><br>
              <em style="color: #666;">"${contact.message.length > 150 ? contact.message.substring(0, 150) + '...' : contact.message}"</em>
            </div>
          </div>

          <!-- What Happens Next -->
          <div class="info-box">
            <h3 style="margin: 0 0 15px; color: #333;">🔄 What Happens Next?</h3>
            <p style="margin: 5px 0;">• Our team will review your inquiry carefully</p>
            <p style="margin: 5px 0;">• You'll receive a personalized response within 2 hours</p>
            <p style="margin: 5px 0;">• For urgent matters, we may call you directly</p>
            <p style="margin: 5px 0;">• We'll provide detailed information and next steps</p>
          </div>

          <!-- Quick Actions -->
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #333; margin-bottom: 20px;">Need Immediate Assistance?</h3>
            <a href="https://wa.me/16574624945" class="cta-button" target="_blank">💬 WhatsApp Us</a>
            <a href="tel:+16574624945" class="cta-button">📞 Call Now</a>
            <a href="https://www.caligolddrive.com/fleet" class="cta-button">🚗 View Fleet</a>
          </div>

          <!-- Contact Information -->
          <div class="contact-info">
            <h3 style="margin: 0 0 15px; color: #1976d2;">📞 Contact Information</h3>
            <p style="margin: 5px 0;"><strong>Phone:</strong> +1 (657) 562-4945</p>
<p style="margin: 5px 0;"><strong>WhatsApp:</strong> +1 (657) 562-4945</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> info@caligolddrive.com</p>
            <p style="margin: 5px 0;"><strong>Service Areas:</strong> Los Angeles, Orange County, San Diego, Riverside</p>
          </div>

          <!-- Social Links -->
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; margin-bottom: 15px;">Follow us for updates and special offers:</p>
            <a href="https://instagram.com/caligolddrive" style="color: #FFD700; text-decoration: none; margin: 0 10px;">📸 Instagram</a>
            <a href="https://facebook.com/caligolddrive" style="color: #FFD700; text-decoration: none; margin: 0 10px;">📘 Facebook</a>
            <a href="https://www.caligolddrive.com" style="color: #FFD700; text-decoration: none; margin: 0 10px;">🌐 Website</a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0;"><strong>CALI GOLD DRIVE</strong></p>
          <p style="margin: 5px 0 0; font-size: 14px;">Premium Transportation Service - Your Luxury Ride Awaits</p>
          <p style="margin: 5px 0 0; font-size: 12px;">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send contact form team notification
export const sendContactFormTeamNotification = async (contactData: ContactFormEmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('Email transporter not available for contact notification');
      return false;
    }

    const htmlContent = generateContactFormTeamEmailHTML(contactData);
    
    const mailOptions = {
      from: {
        name: 'CALI GOLD DRIVE Contact System',
        address: EMAIL_CONFIG.auth.user
      },
      to: NOTIFICATION_EMAILS,
      subject: `📧 NEW CONTACT INQUIRY - ${contactData.name} - ${contactData.subject}`,
      html: htmlContent,
      priority: 'high' as const
    };

    console.log('📧 Sending contact form team notification...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Contact form team notification sent successfully:', result.messageId);
    return true;

  } catch (error) {
    console.error('❌ Failed to send contact form team notification:', error);
    return false;
  }
};

// Send contact form customer confirmation
export const sendContactFormCustomerConfirmation = async (contactData: ContactFormEmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('Email transporter not available for customer confirmation');
      return false;
    }

    const htmlContent = generateContactFormCustomerEmailHTML(contactData);
    
    const mailOptions = {
      from: {
        name: 'CALI GOLD DRIVE',
        address: EMAIL_CONFIG.auth.user
      },
      to: contactData.email,
      subject: `✅ Thank you for contacting CALI GOLD DRIVE - We'll respond within 2 hours`,
      html: htmlContent,
      priority: 'normal' as const
    };

    console.log('📧 Sending customer confirmation email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Customer confirmation email sent successfully:', result.messageId);
    return true;

  } catch (error) {
    console.error('❌ Failed to send customer confirmation email:', error);
    return false;
  }
}; 