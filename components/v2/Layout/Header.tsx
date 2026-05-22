import * as React from 'react';
import NextLink from 'next/link';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import BookTypeMenu from 'components/v2/Layout/BookTypeMenu';
import { useRecoilValue } from 'recoil';
import { shoppingCartState } from 'atoms';
import { useAuth } from '../../../contexts/AuthContext';

export interface HeaderProps {
  hideMenu?: boolean;
}

export default function Header(props: HeaderProps) {
  const { hideMenu } = props;
  const { user, logout, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const cartItems = useRecoilValue(shoppingCartState);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NextLink href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bookstore
              </span>
            </NextLink>
          </div>

          {/* Desktop Navigation - Center */}
          {!hideMenu && (
            <div className="hidden lg:flex lg:items-center lg:space-x-10">
              <NextLink
                href="/"
                className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                Home
              </NextLink>
              <NextLink
                href="/#books"
                className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                Books
              </NextLink>
            </div>
          )}

          {/* Desktop Actions - Right */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <NextLink
              href="/cart"
              className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </NextLink>

            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span>{user.name}</span>
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-50 border dark:border-gray-700">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <NextLink
                      href="/login"
                      className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Login
                    </NextLink>
                    <NextLink
                      href="/register"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Register
                    </NextLink>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen
          ? 'max-h-screen opacity-100 py-4'
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-white dark:bg-gray-900 border-t dark:border-gray-700">
          <div className="px-4 py-3 space-y-3">
            {!hideMenu && (
              <>
                <NextLink
                  href="/"
                  className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </NextLink>
                <NextLink
                  href="/#books"
                  className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Books
                </NextLink>
              </>
            )}

            <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
              <NextLink href="/cart" className="relative p-2 text-gray-600 dark:text-gray-300">
                <ShoppingCartIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </NextLink>
            </div>

            {!loading && !user && (
              <div className="flex space-x-3 pt-2">
                <NextLink
                  href="/login"
                  className="flex-1 text-center text-gray-700 dark:text-gray-300 font-medium py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NextLink>
                <NextLink
                  href="/register"
                  className="flex-1 text-center bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </NextLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}