import { NextResponse } from 'next/server';
import { sendOTP } from '@/lib/twilio';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Send OTP
    const status = await sendOTP(phone);

    return NextResponse.json({
      message: 'OTP sent successfully',
      status,
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
} 