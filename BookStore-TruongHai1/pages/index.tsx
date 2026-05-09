import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRecoilState } from 'recoil';
import { useSnackbar } from 'notistack';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BookList from '../components/BookList';
import Footer from '../components/Footer';

import { shoppingCartState } from '../atoms';
import { BookProps } from '../const';

// Dummy data for demonstration
const dummyBooks: BookProps[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    type: 'Novel',
    publishedAt: '2024-01-01',
    price: '12.99',
    averageRating: 4.5,
    authors: [{ author: { id: '1', name: 'F. Scott Fitzgerald' } }],
    stock: 15,
    ratings: 0,
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    type: 'Novel',
    publishedAt: '2024-01-01',
    price: '14.99',
    averageRating: 4.8,
    authors: [{ author: { id: '2', name: 'Harper Lee' } }],
    stock: 8,
    ratings: 0,
  },
  {
    id: '3',
    title: '1984',
    type: 'Novel',
    publishedAt: '2024-01-01',
    price: '11.99',
    averageRating: 4.7,
    authors: [{ author: { id: '3', name: 'George Orwell' } }],
    stock: 20,
    ratings: 0,
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    type: 'Novel',
    publishedAt: '2024-01-01',
    price: '9.99',
    averageRating: 4.6,
    authors: [{ author: { id: '4', name: 'Jane Austen' } }],
    stock: 12,
    ratings: 0,
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    type: 'Novel',
    publishedAt: '2024-01-01',
    price: '13.99',
    averageRating: 4.2,
    authors: [{ author: { id: '5', name: 'J.D. Salinger' } }],
    stock: 5,
    ratings: 0,
  },
  {
    id: '6',
    title: 'The Hobbit',
    type: 'Novel',
    publishedAt: '2024-01-01',
    price: '15.99',
    averageRating: 4.9,
    authors: [{ author: { id: '6', name: 'J.R.R. Tolkien' } }],
    stock: 25,
    ratings: 0,
  },
  {
    id: '7',
    title: 'Harry Potter and the Philosopher\'s Stone',
    type: 'Novel',
    publishedAt: '2024-01-01',
    price: '18.99',
    averageRating: 4.8,
    authors: [{ author: { id: '7', name: 'J.K. Rowling' } }],
    stock: 30,
    ratings: 0,
  },
  {
    id: '8',
    title: 'The Alchemist',
    type: 'Novel',
    publishedAt: '2024-01-01',
    price: '10.99',
    averageRating: 4.5,
    authors: [{ author: { id: '8', name: 'Paulo Coelho' } }],
    stock: 18,
    ratings: 0,
  },
];

export default function HomePage() {
  const [shoppingCart, setShoppingCart] = useRecoilState(shoppingCartState);
  const { enqueueSnackbar } = useSnackbar();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const count = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemCount(count);
  }, [shoppingCart]);

  const handleAddToCart = (book: BookProps) => {
    setShoppingCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        if (existingItem.quantity >= book.stock) {
          enqueueSnackbar(`Out of stock!`, { variant: 'error' });
          return prevCart;
        }
        enqueueSnackbar(`"${book.title}" quantity updated.`, { variant: 'success' });
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      enqueueSnackbar(`"${book.title}" added to cart.`, { variant: 'success' });
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  return (
    <>
      <Head>
        <title>Bookstore - Your Destination for Great Books</title>
        <meta name="description" content="Discover thousands of books at Bookstore. Best sellers, new arrivals, and more." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar cartItemCount={cartItemCount} />
        
        <main className="flex-grow pt-16">
          <Hero />
          
          {/* Books Section */}
          <section id="books" className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium mb-4">
                  Our Collection
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  Featured Books
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Explore our curated selection of bestsellers and new arrivals. Find your next favorite read today.
                </p>
              </div>

              {/* Book Grid */}
              <BookList books={dummyBooks} onAddToCart={handleAddToCart} />

              {/* View More Button */}
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200">
                  View All Books
                </button>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block px-4 py-1 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400 rounded-full text-sm font-medium mb-4">
                    About Us
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                    Your Trusted Online Bookstore
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    At Bookstore, we believe that every book is a new adventure waiting to happen. 
                    Since our founding, we've been dedicated to connecting readers with the books they love.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    With a collection of over 10,000 titles across all genres, from bestsellers to hidden gems, 
                    we're here to help you discover your next great read.
                  </p>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">10K+</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Books</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">50K+</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">4.9</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-100 dark:bg-indigo-900 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-pink-100 dark:bg-pink-900 rounded-full blur-3xl"></div>
                  <div className="relative grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="w-full h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <span className="text-5xl">📚</span>
                      </div>
                      <div className="w-full h-32 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center">
                        <span className="text-4xl">✨</span>
                      </div>
                    </div>
                    <div className="space-y-4 pt-8">
                      <div className="w-full h-32 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                        <span className="text-4xl">🌟</span>
                      </div>
                      <div className="w-full h-40 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                        <span className="text-5xl">🎯</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-white/90 mb-8">
                Subscribe to our newsletter to get the latest books, exclusive deals, and author updates.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}