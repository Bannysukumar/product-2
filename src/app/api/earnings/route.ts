import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const user = await db.collection('users').findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all withdrawals for the user
    const withdrawals = await db.collection('withdrawals')
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    // Calculate total earnings from referrals
    const referralEarnings = await calculateReferralEarnings(db, user._id);

    // Calculate pending withdrawals
    const pendingWithdrawals = withdrawals
      .filter(w => w.status === 'pending')
      .reduce((sum, w) => sum + w.amount, 0);

    // Calculate total processed withdrawals
    const processedWithdrawals = withdrawals
      .filter(w => w.status === 'processed')
      .reduce((sum, w) => sum + w.amount, 0);

    // Calculate available balance
    const availableBalance = referralEarnings - processedWithdrawals - pendingWithdrawals;

    return NextResponse.json({
      totalEarnings: referralEarnings,
      availableBalance,
      pendingWithdrawals,
      withdrawals: withdrawals.map(w => ({
        id: w._id.toString(),
        amount: w.amount,
        status: w.status,
        paymentMethod: w.paymentMethod,
        createdAt: w.createdAt,
        processedAt: w.processedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching earnings data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function calculateReferralEarnings(db: any, userId: ObjectId) {
  // Get all direct referrals (Level 1)
  const directReferrals = await db.collection('users')
    .find({ referredBy: userId })
    .toArray();

  let totalEarnings = 0;

  // Calculate Level 1 earnings (10% of membership fee)
  totalEarnings += directReferrals.length * (1000 * 0.10);

  // For each direct referral, get their referrals (Level 2)
  for (const referral of directReferrals) {
    const level2Referrals = await db.collection('users')
      .find({ referredBy: referral._id })
      .toArray();

    // Calculate Level 2 earnings (5% of membership fee)
    totalEarnings += level2Referrals.length * (1000 * 0.05);

    // For each Level 2 referral, get their referrals (Level 3)
    for (const level2Referral of level2Referrals) {
      const level3Referrals = await db.collection('users')
        .find({ referredBy: level2Referral._id })
        .toArray();

      // Calculate Level 3 earnings (3% of membership fee)
      totalEarnings += level3Referrals.length * (1000 * 0.03);

      // For each Level 3 referral, get their referrals (Level 4)
      for (const level3Referral of level3Referrals) {
        const level4Referrals = await db.collection('users')
          .find({ referredBy: level3Referral._id })
          .toArray();

        // Calculate Level 4 earnings (2% of membership fee)
        totalEarnings += level4Referrals.length * (1000 * 0.02);

        // For each Level 4 referral, get their referrals (Level 5)
        for (const level4Referral of level4Referrals) {
          const level5Referrals = await db.collection('users')
            .find({ referredBy: level4Referral._id })
            .toArray();

          // Calculate Level 5 earnings (1% of membership fee)
          totalEarnings += level5Referrals.length * (1000 * 0.01);
        }
      }
    }
  }

  return totalEarnings;
} 