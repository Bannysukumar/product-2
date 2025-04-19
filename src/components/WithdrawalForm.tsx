import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiDollarSign, FiCreditCard } from 'react-icons/fi';

interface WithdrawalFormProps {
  availableBalance: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface AccountDetails {
  bankTransfer: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  phonepe: {
    phoneNumber: string;
    upiId: string;
  };
  googlepay: {
    phoneNumber: string;
    upiId: string;
  };
}

export default function WithdrawalForm({ availableBalance, onSuccess, onCancel }: WithdrawalFormProps) {
  const [loading, setLoading] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    bankTransfer: {
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
    },
    phonepe: {
      phoneNumber: '',
      upiId: '',
    },
    googlepay: {
      phoneNumber: '',
      upiId: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!withdrawalAmount || Number(withdrawalAmount) < 500) {
      toast.error('Minimum withdrawal amount is ₹500');
      return;
    }

    if (Number(withdrawalAmount) > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    // Validate account details based on payment method
    if (paymentMethod === 'bank_transfer') {
      if (!accountDetails.bankTransfer.accountNumber || 
          !accountDetails.bankTransfer.ifscCode || 
          !accountDetails.bankTransfer.accountHolderName) {
        toast.error('Please fill all bank account details');
        return;
      }
    } else if (paymentMethod === 'phonepe' || paymentMethod === 'googlepay') {
      const details = accountDetails[paymentMethod as keyof AccountDetails];
      if (!details.phoneNumber || !details.upiId) {
        toast.error('Please fill all UPI details');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await fetch('/api/earnings/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(withdrawalAmount),
          paymentMethod,
          accountDetails: accountDetails[paymentMethod as keyof AccountDetails],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success('Withdrawal request submitted successfully');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDetailsChange = (
    method: keyof AccountDetails,
    field: string,
    value: string
  ) => {
    setAccountDetails(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Request Withdrawal
        </h2>
        <div className="text-sm text-gray-500">
          Available Balance: ₹{availableBalance}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (₹)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              min="500"
              max={availableBalance}
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">INR</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Minimum withdrawal amount: ₹500
          </p>
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              required
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="phonepe">PhonePe</option>
              <option value="googlepay">Google Pay</option>
            </select>
          </div>
        </div>

        {/* Bank Transfer Details */}
        {paymentMethod === 'bank_transfer' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                value={accountDetails.bankTransfer.accountNumber}
                onChange={(e) => handleAccountDetailsChange('bankTransfer', 'accountNumber', e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                IFSC Code
              </label>
              <input
                type="text"
                id="ifscCode"
                value={accountDetails.bankTransfer.ifscCode}
                onChange={(e) => handleAccountDetailsChange('bankTransfer', 'ifscCode', e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                Account Holder Name
              </label>
              <input
                type="text"
                id="accountHolderName"
                value={accountDetails.bankTransfer.accountHolderName}
                onChange={(e) => handleAccountDetailsChange('bankTransfer', 'accountHolderName', e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        )}

        {/* UPI Payment Details (PhonePe/Google Pay) */}
        {(paymentMethod === 'phonepe' || paymentMethod === 'googlepay') && (
          <div className="space-y-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={accountDetails[paymentMethod as keyof AccountDetails].phoneNumber}
                onChange={(e) => handleAccountDetailsChange(paymentMethod as keyof AccountDetails, 'phoneNumber', e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                UPI ID
              </label>
              <input
                type="text"
                id="upiId"
                value={accountDetails[paymentMethod as keyof AccountDetails].upiId}
                onChange={(e) => handleAccountDetailsChange(paymentMethod as keyof AccountDetails, 'upiId', e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
} 