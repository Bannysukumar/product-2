import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { FiUsers, FiShoppingBag, FiGift, FiCreditCard } from 'react-icons/fi';

export default function HomePage() {
  const features = [
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: 'Join Our Network',
      description: 'Become a part of our growing community and unlock exclusive benefits.',
    },
    {
      icon: <FiShoppingBag className="h-6 w-6" />,
      title: 'Exclusive Discounts',
      description: 'Get amazing discounts at our partner stores across various categories.',
    },
    {
      icon: <FiGift className="h-6 w-6" />,
      title: 'Referral Benefits',
      description: 'Earn rewards by referring friends and family to our network.',
    },
    {
      icon: <FiCreditCard className="h-6 w-6" />,
      title: 'One-Time Investment',
      description: 'Pay ₹3,200 once and enjoy benefits for a lifetime.',
    },
  ];

  const categories = [
    'Gold Jewelry',
    'Groceries',
    'Clothing & Apparel',
    'Home Appliances',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Welcome to Vehash Global Marketing
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
              Join our exclusive membership program and unlock amazing discounts at partnered stores.
              Earn through referrals and build your network.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/auth/register"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
              >
                Join Now
              </Link>
              <Link
                href="/how-it-works"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Vehash Global?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Discover the benefits of being a part of our exclusive network
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Shop Across Categories
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Get exclusive discounts at our partner stores
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="px-6 py-8">
                  <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Exclusive discounts available
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Join Vehash Global today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            One-time membership fee of ₹3,200. Lifetime benefits and earnings through referrals.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
} 