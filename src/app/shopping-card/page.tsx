'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { FiDownload, FiShare2 } from 'react-icons/fi';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

export default function ShoppingCardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'vehash-shopping-card.png';
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current);
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      if (navigator.share) {
        const file = new File([blob], 'vehash-shopping-card.png', { type: 'image/png' });
        await navigator.share({
          title: 'Vehash Global Shopping Card',
          text: 'My Vehash Global Shopping Card',
          files: [file],
        });
      }
    } catch (error) {
      console.error('Error sharing card:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Shopping Card</h1>
            <p className="mt-2 text-gray-600">
              Show this card at partner stores to get exclusive discounts
            </p>
          </div>

          {/* Shopping Card */}
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div
              ref={cardRef}
              className="relative p-8 bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              {/* Logo and Brand */}
              <div className="text-white mb-6">
                <h2 className="text-2xl font-bold">Vehash Global</h2>
                <p className="text-indigo-100">Member Shopping Card</p>
              </div>

              {/* Member Details */}
              <div className="space-y-4 text-white">
                <div>
                  <p className="text-sm text-indigo-100">Member Name</p>
                  <p className="font-semibold">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-100">Member ID</p>
                  <p className="font-semibold">{session.user.memberId || 'Not Available'}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-100">Phone Number</p>
                  <p className="font-semibold">{session.user.phone}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="absolute bottom-4 right-4">
                <p className="text-xs text-indigo-100">Valid at all partner stores</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FiDownload className="mr-2 h-5 w-5" />
              Download Card
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              <FiShare2 className="mr-2 h-5 w-5" />
              Share Card
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">How to use your shopping card:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Download or take a screenshot of your shopping card</li>
              <li>Show it at any of our partner stores</li>
              <li>Get instant discounts on your purchases</li>
              <li>Card is valid for lifetime</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
} 