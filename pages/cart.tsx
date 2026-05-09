import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { useSnackbar } from 'notistack';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

import { shoppingCartState } from '../atoms';
import { shoppingCartItemProps } from '../const';
import { currencyFormat, calcCartItemTotalPrice } from '../lib/utils';

const Cart: NextPage = () => {
  const [cart, setCart] = useRecoilState(shoppingCartState);
  const { enqueueSnackbar } = useSnackbar();

  // Calculate totals
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  // Update quantity
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item;
        if (newQty > item.stock) {
          enqueueSnackbar('Not enough stock', { variant: 'warning' });
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // Remove item
  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    enqueueSnackbar('Item removed from cart', { variant: 'success' });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    enqueueSnackbar('Cart cleared', { variant: 'info' });
  };

  return (
    <>
      <Head>
        <title>Shopping Cart</title>
        <meta name="description" content="Your shopping cart" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Continue Shopping</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Shopping Cart</h1>
              <div className="w-20" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {cart.length === 0 ? (
            // Empty cart
            <div className="text-center py-16">
              <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your cart is empty</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Add some books to get started!</p>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Browse Books
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-950 overflow-hidden p-4 transition-all hover:shadow-lg"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <Link href={`/book/${item.id}`} className="flex-shrink-0">
                        <div className="w-24 h-36 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <Image
                            src={`https://picsum.photos/seed/${item.id}/200/300`}
                            alt={item.title}
                            width={96}
                            height={144}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/book/${item.id}`}>
                          <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-2 hover:text-purple-600 transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {item.authors?.map((a: any) => a.author?.name).join(', ') || 'Unknown Author'}
                        </p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-2">
                          ${item.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                          >
                            <MinusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-800 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total & Delete */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800 dark:text-white">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              ${item.price} x {item.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-950 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Items ({itemCount})</span>
                  <span className="text-gray-800 dark:text-white font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-bold text-gray-800 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => enqueueSnackbar('Checkout coming soon!', { variant: 'info' })}
                  className="w-full py-4 bg-purple-600 text-white text-lg font-bold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full mt-3 py-3 text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;