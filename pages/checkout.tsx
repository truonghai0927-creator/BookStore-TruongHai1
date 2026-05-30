import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { useSnackbar } from 'notistack';
import axios from 'axios';

import Header from '../components/Header';
import { shoppingCartState } from '../atoms';

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useRecoilState(shoppingCartState);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      enqueueSnackbar('Please enter your name', { variant: 'error' });
      return false;
    }
    if (!formData.phone.trim()) {
      enqueueSnackbar('Please enter your phone number', { variant: 'error' });
      return false;
    }
    if (!formData.address.trim()) {
      enqueueSnackbar('Please enter your address', { variant: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || cart.length === 0) return;

    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await axios.post('/api/orders', {
        ...formData,
        items: orderItems
      });

      setCart([]);
      router.push(`/success?orderId=${response.data.id}`);
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to place order', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="order-2 md:order-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-white">{item.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800 dark:text-white">Total</span>
                    <span className="text-indigo-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="order-1 md:order-2">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Shipping Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your shipping address"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}