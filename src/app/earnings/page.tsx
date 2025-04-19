'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { FiDollarSign, FiCreditCard, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import WithdrawalForm from '@/components/WithdrawalForm';

interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'processed' | 'rejected';
  paymentMethod: string;
  createdAt: string;
  processedAt?: string;
}

interface EarningsData {
  totalEarnings: number;
  availableBalance: number;
  pendingWithdrawals: number;
  withdrawals: Withdrawal[];
}

export default function EarningsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  useEffect(() => {
    if (session) {
      fetchEarningsData();
    }
  }, [session]);

  const fetchEarningsData = async () => {
    try {
      const res = await fetch('/api/earnings');
      const data = await res.json();
      setEarningsData(data);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!withdrawalAmount || Number(withdrawalAmount) < 500) {
      toast.error('Minimum withdrawal amount is ₹500');
      return;
    }

    if (Number(withdrawalAmount) > (earningsData?.availableBalance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      const res = await fetch('/api/earnings/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(withdrawalAmount),
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success('Withdrawal request submitted successfully');
      setWithdrawalAmount('');
      setShowWithdrawalForm(false);
      fetchEarningsData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit withdrawal request');
    }
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
          {/* Earnings Overview */}
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              My Earnings
            </h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-5">
                <div className="flex items-center">
                  <FiDollarSign className="h-6 w-6 text-green-500" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Total Earnings
                  </span>
                </div>
                <div className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{earningsData?.totalEarnings || 0}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-5">
                <div className="flex items-center">
                  <FiCreditCard className="h-6 w-6 text-blue-500" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Available Balance
                  </span>
                </div>
                <div className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{earningsData?.availableBalance || 0}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-5">
                <div className="flex items-center">
                  <FiClock className="h-6 w-6 text-yellow-500" />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    Pending Withdrawals
                  </span>
                </div>
                <div className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{earningsData?.pendingWithdrawals || 0}
                </div>
              </div>
            </div>

            {/* Withdrawal Button */}
            {(earningsData?.availableBalance || 0) >= 500 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowWithdrawalForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Request Withdrawal
                </button>
              </div>
            )}
          </div>

          {/* Withdrawal Form */}
          {showWithdrawalForm && (
            <WithdrawalForm
              availableBalance={earningsData?.availableBalance || 0}
              onSuccess={() => {
                setShowWithdrawalForm(false);
                fetchEarningsData();
              }}
              onCancel={() => setShowWithdrawalForm(false)}
            />
          )}

          {/* Withdrawal History */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-5 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                Withdrawal History
              </h2>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {earningsData?.withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{withdrawal.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {withdrawal.paymentMethod.replace('_', ' ').toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              withdrawal.status === 'processed'
                                ? 'bg-green-100 text-green-800'
                                : withdrawal.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!earningsData?.withdrawals || earningsData.withdrawals.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          No withdrawal history
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 