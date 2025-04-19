import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyOTP } from '@/lib/twilio';

export async function POST(req: Request) {
  try {
    const { name, phone, password, email, otp, referralId } = await req.json();

    if (!name || !phone || !password || !otp) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { phone },
        ...(email ? [{ email }] : []),
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this phone number or email' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isOTPValid = await verifyOTP(phone, otp);
    if (!isOTPValid) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Find referrer if referral ID is provided
    let referredBy = null;
    if (referralId) {
      referredBy = await User.findOne({ referralId });
      if (!referredBy) {
        return NextResponse.json(
          { error: 'Invalid referral ID' },
          { status: 400 }
        );
      }
    } else {
      // If no referral ID, assign to admin (you'll need to create an admin user first)
      referredBy = await User.findOne({ isAdmin: true });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      phoneVerified: true,
      referredBy: referredBy?._id,
    });

    // Update referrer's direct referrals
    if (referredBy) {
      await User.findByIdAndUpdate(referredBy._id, {
        $push: { directReferrals: user._id },
      });
    }

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 