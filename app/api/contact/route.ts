import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormTeamNotification, sendContactFormCustomerConfirmation, ContactFormEmailData } from '@/lib/email';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://45.32.74.216/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('📧 Processing contact form submission for:', body.email);

    // Forward request to backend
    const response = await fetch(`${API_BASE_URL}/public/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phoneNumber: body.phone || '',
        subject: body.subject || 'Contact Form Submission',
        message: body.message,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Contact form was successfully saved to database
      console.log('✅ Contact form saved to database successfully');

      // Prepare email data
      const emailData: ContactFormEmailData = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        subject: body.subject || 'Contact Form Submission',
        message: body.message,
        submittedAt: new Date().toISOString(),
        id: data.data?.id || undefined
      };

      // Send both emails concurrently
      const [teamEmailSent, customerEmailSent] = await Promise.allSettled([
        sendContactFormTeamNotification(emailData),
        sendContactFormCustomerConfirmation(emailData)
      ]);

      // Log email results
      if (teamEmailSent.status === 'fulfilled' && teamEmailSent.value) {
        console.log('✅ Team notification email sent successfully');
      } else {
        console.log('❌ Failed to send team notification email:', teamEmailSent.status === 'rejected' ? teamEmailSent.reason : 'Unknown error');
      }

      if (customerEmailSent.status === 'fulfilled' && customerEmailSent.value) {
        console.log('✅ Customer confirmation email sent successfully');
      } else {
        console.log('❌ Failed to send customer confirmation email:', customerEmailSent.status === 'rejected' ? customerEmailSent.reason : 'Unknown error');
      }

      // Return success response regardless of email status
      // (Contact form submission is more important than email notifications)
      return NextResponse.json({
        ...data,
        emailNotifications: {
          teamNotificationSent: teamEmailSent.status === 'fulfilled' && teamEmailSent.value,
          customerConfirmationSent: customerEmailSent.status === 'fulfilled' && customerEmailSent.value
        }
      });
    } else {
      console.log('❌ Failed to save contact form to database:', data.message);
      return NextResponse.json(
        { error: data.message || 'Failed to submit contact form' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('❌ Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 