'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { FiUsers, FiCreditCard, FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
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

  const quickActions = [
    {
      icon: <FiShoppingBag className="h-6 w-6" />,
      title: 'Shopping Card',
      description: 'View and download your shopping card',
      href: '/shopping-card',
      color: 'bg-blue-500',
    },
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: 'My Referrals',
      description: 'Manage your referral network',
      href: '/referrals',
      color: 'bg-green-500',
    },
    {
      icon: <FiDollarSign className="h-6 w-6" />,
      title: 'Earnings',
      description: 'Track and withdraw your earnings',
      href: '/earnings',
      color: 'bg-purple-500',
    },
    {
      icon: <FiCreditCard className="h-6 w-6" />,
      title: 'Membership Status',
      description: session.user.membershipStatus === 'paid' ? 'Paid Member' : 'Free Member',
      href: '/membership',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {session.user.name}!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Member ID: {session.user.memberId || 'Not available'}
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className={`${action.color} rounded-md p-3 inline-flex`}>
                      {action.icon}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {action.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Membership Status */}
          {session.user.membershipStatus !== 'paid' && (
            <div className="mt-8 bg-indigo-50 rounded-lg shadow-sm p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiCreditCard className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-indigo-900">
                    Upgrade to Paid Membership
                  </h3>
                  <p className="mt-2 text-sm text-indigo-700">
                    Unlock exclusive discounts and start earning through referrals by becoming a paid member.
                    One-time payment of ₹3,200 only.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/membership/upgrade"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Upgrade Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 