'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { FiUsers, FiLink, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ReferralLevel {
  level: number;
  count: number;
  earnings: number;
  percentage: number;
  users?: {
    name: string;
    memberId: string;
    joinedAt: string;
  }[];
}

export default function ReferralsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [referralData, setReferralData] = useState<ReferralLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchReferralData();
    }
  }, [session]);

  const fetchReferralData = async () => {
    try {
      const res = await fetch('/api/referrals');
      const data = await res.json();
      setReferralData(data);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/auth/register?ref=${session?.user.referralId}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold text-gray-900">
                  My Referral Network
                </h1>
                {session.user.referralId && (
                  <p className="mt-1 text-sm text-gray-500">
                    Your Referral ID: {session.user.referralId}
                  </p>
                )}
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <button
                  onClick={copyReferralLink}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <FiLink className="mr-2 h-5 w-5" />
                  Copy Referral Link
                </button>
              </div>
            </div>
          </div>

          {/* Referral Stats */}
          <div className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {referralData.map((level) => (
              <div
                key={level.level}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiUsers className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Level {level.level} Referrals
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {level.count}
                          </div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            {level.percentage}%
                          </div>
                        </dd>
                      </dl>
                      <p className="mt-1 text-sm text-gray-500">
                        Earnings: ₹{level.earnings}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Level 1 Referrals Detail */}
                {level.level === 1 && level.users && level.users.length > 0 && (
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Direct Referrals
                      </h4>
                      <ul className="space-y-2">
                        {level.users.map((user, index) => (
                          <li key={index} className="flex justify-between">
                            <span className="text-gray-600">{user.name}</span>
                            <span className="text-gray-500 text-xs">
                              {new Date(user.joinedAt).toLocaleDateString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-12 bg-white rounded-lg shadow px-5 py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              How the Referral System Works
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Earning Structure</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Level 1 (Direct Referrals): 5% commission</li>
                  <li>Level 2: 3% commission</li>
                  <li>Level 3: 2% commission</li>
                  <li>Level 4: 1% commission</li>
                  <li>Level 5: 1% commission</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How to Refer</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Copy your unique referral link</li>
                  <li>Share it with potential members</li>
                  <li>Earn commission when they join as paid members</li>
                  <li>Track your earnings in real-time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 