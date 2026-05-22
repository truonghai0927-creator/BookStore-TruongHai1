import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

import Header from '../components/Header';

export default function Success() {
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    if (!router.isReady || !orderId) {
      router.push('/');
    }
  }, [router, orderId]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />

        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Order Placed Successfully!
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Thank you for your purchase. Your order has been placed.
            </p>

            <p className="text-gray-500 dark:text-gray-500 text-sm mb-8">
              Order ID: #{orderId}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/cart"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}