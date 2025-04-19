import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get the current user
    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get direct referrals (Level 1)
    const directReferrals = await User.find({
      referredBy: currentUser._id,
    }).select('name memberId createdAt');

    // Calculate earnings and referral counts for each level
    const referralData = [
      {
        level: 1,
        count: directReferrals.length,
        earnings: calculateEarnings(directReferrals.length, 5),
        percentage: 5,
        users: directReferrals.map(user => ({
          name: user.name,
          memberId: user.memberId,
          joinedAt: user.createdAt,
        })),
      },
      {
        level: 2,
        count: await getIndirectReferralCount(directReferrals.map(r => r._id)),
        earnings: calculateEarnings(await getIndirectReferralCount(directReferrals.map(r => r._id)), 3),
        percentage: 3,
      },
      {
        level: 3,
        count: await getIndirectReferralCount(
          await getIndirectReferralIds(directReferrals.map(r => r._id))
        ),
        earnings: calculateEarnings(
          await getIndirectReferralCount(
            await getIndirectReferralIds(directReferrals.map(r => r._id))
          ),
          2
        ),
        percentage: 2,
      },
      {
        level: 4,
        count: await getIndirectReferralCount(
          await getIndirectReferralIds(
            await getIndirectReferralIds(directReferrals.map(r => r._id))
          )
        ),
        earnings: calculateEarnings(
          await getIndirectReferralCount(
            await getIndirectReferralIds(
              await getIndirectReferralIds(directReferrals.map(r => r._id))
            )
          ),
          1
        ),
        percentage: 1,
      },
      {
        level: 5,
        count: await getIndirectReferralCount(
          await getIndirectReferralIds(
            await getIndirectReferralIds(
              await getIndirectReferralIds(directReferrals.map(r => r._id))
            )
          )
        ),
        earnings: calculateEarnings(
          await getIndirectReferralCount(
            await getIndirectReferralIds(
              await getIndirectReferralIds(
                await getIndirectReferralIds(directReferrals.map(r => r._id))
              )
            )
          ),
          1
        ),
        percentage: 1,
      },
    ];

    return NextResponse.json(referralData);
  } catch (error) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate earnings
function calculateEarnings(referralCount: number, percentage: number): number {
  const membershipFee = 3200; // ₹3,200
  return (membershipFee * referralCount * percentage) / 100;
}

// Helper function to get indirect referral count
async function getIndirectReferralCount(parentIds: string[]): Promise<number> {
  const indirectReferrals = await User.countDocuments({
    referredBy: { $in: parentIds },
  });
  return indirectReferrals;
}

// Helper function to get indirect referral IDs
async function getIndirectReferralIds(parentIds: string[]): Promise<string[]> {
  const indirectReferrals = await User.find({
    referredBy: { $in: parentIds },
  }).select('_id');
  return indirectReferrals.map(r => r._id);
} 