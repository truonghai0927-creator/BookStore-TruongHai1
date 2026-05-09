import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden pt-8 md:pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
              Welcome to Bookstore
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Discover Your Next
              <span className="block text-yellow-300">Great Read</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg mx-auto md:mx-0">
              Explore thousands of books across all genres. From bestsellers to hidden gems, find your perfect read today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/#books"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Browse Books
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="hidden md:block relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="w-full h-40 bg-white/90 rounded-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                  <div className="w-full h-32 bg-white/80 rounded-xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                    <span className="text-3xl">✨</span>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="w-full h-32 bg-white/80 rounded-xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                    <span className="text-3xl">📖</span>
                  </div>
                  <div className="w-full h-40 bg-white/90 rounded-xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                    <span className="text-4xl">🎯</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}