import * as React from 'react';
import NextLink from 'next/link';
import {
  Bars3Icon,
  ShoppingCartIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import ThemeToggle from '../../../components/ThemeToggle';

import BookTypeMenu from 'components/v2/Layout/BookTypeMenu';
import { shoppingCartState } from 'atoms';
import { useRecoilState } from 'recoil';
import { useAuth } from '../../../contexts/AuthContext';

import { calcCartItemSum } from 'lib/utils';

export interface HeaderProps {
  hideMenu?: boolean;
}

export default function Header(props: HeaderProps) {
  const { hideMenu } = props;
  const { user, logout, loading } = useAuth();

  const [shoppingCart, setShoppingCart] = useRecoilState(shoppingCartState);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left section */}
            <div className="flex items-center">
              {!hideMenu && (
                <div className="dropdown">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle content-center"
                  >
                    <Bars3Icon className="w-6 h-6" />
                  </label>
                  <BookTypeMenu />
                </div>
              )}
            </div>

            {/* Center - Logo */}
            <div className="navbar-center">
              <NextLink href="/" className="flex items-center space-x-2 btn btn-ghost normal-case text-xl">
                <BookOpenIcon className="w-6 h-6 text-indigo-600" />
                <span className="text-gray-900 dark:text-white font-bold">Bookstore</span>
              </NextLink>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />

              <NextLink href="/cart" className="relative btn btn-ghost btn-circle">
                <div className="indicator">
                  <ShoppingCartIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                  <span className="badge badge-sm indicator-item">
                    {calcCartItemSum(shoppingCart)}
                  </span>
                </div>
              </NextLink>

              {!loading && (
                <>
                  {user ? (
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost text-gray-700 dark:text-gray-200">
                        {user.name}
                      </label>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
                        <li>
                          <button onClick={logout} className="btn btn-ghost">
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <NextLink href="/login" className="btn btn-ghost btn-sm">
                        Login
                      </NextLink>
                      <NextLink href="/register" className="btn btn-primary btn-sm">
                        Register
                      </NextLink>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
