import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendOTP(phone: string) {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_ID!)
      .verifications.create({
        to: phone,
        channel: 'sms',
      });
    return verification.status;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
}

export async function verifyOTP(phone: string, code: string) {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_ID!)
      .verificationChecks.create({
        to: phone,
        code,
      });
    return verification.status === 'approved';
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
} 