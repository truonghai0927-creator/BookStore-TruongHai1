import * as React from 'react';
import { useEffect, useState } from 'react';

import BookReviewsSection from 'components/v2/BookDetails/BookReviewsSection';
import CommonLayout from 'components/v2/Layout';
import Head from 'next/head';
import type { NextPage } from 'next';
import { bookDetailsIdState } from 'atoms';
import dynamic from 'next/dynamic';
import { useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import axios from 'axios';
import { BookDetailProps } from 'const';
import Link from 'next/link';

const BookInfoSection = dynamic(import('components/v2/BookDetails/BookInfoSection'), { ssr: false })

const Book: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const setBookDetailsId = useSetRecoilState(bookDetailsIdState);
  
  const [bookData, setBookData] = useState<BookDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBook() {
      // Skip if no id yet or already cancelled
      if (!id || cancelled) return;
      
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/books/${id}`);
        
        if (cancelled) return;
        
        if (response.status === 200) {
          setBookData(response.data);
          setBookDetailsId(id as string);
        } else if (response.status === 404) {
          setError('Book not found');
        }
      } catch (err: any) {
        if (cancelled) return;
        console.error('Fetch book error:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load book');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    // Only fetch when router is ready and we have an id
    if (router.isReady && id) {
      fetchBook();
    }

    return () => {
      cancelled = true;
    };
  }, [id, router.isReady, setBookDetailsId]);

  // Loading state - router not ready
  if (!router.isReady) {
    return (
      <CommonLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </CommonLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Head>
          <title>Book Not Found</title>
        </Head>
        <CommonLayout headerProps={{ hideMenu: true }}>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Book Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error}
              </p>
              <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
                Go to Home
              </Link>
            </div>
          </div>
        </CommonLayout>
      </>
    );
  }

  // Loading state - fetching book
  if (loading) {
    return (
      <CommonLayout headerProps={{ hideMenu: true }}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading book...</p>
          </div>
        </div>
      </CommonLayout>
    );
  }

  // No book data
  if (!bookData) {
    return (
      <>
        <Head>
          <title>Book Not Found</title>
        </Head>
        <CommonLayout headerProps={{ hideMenu: true }}>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Book Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The book you're looking for doesn't exist.
              </p>
              <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
                Go to Home
              </Link>
            </div>
          </div>
        </CommonLayout>
      </>
    );
  }

  // Success - show book
  return (
    <>
      <Head>
        <title>{bookData.title || 'Book Details'}</title>
        <meta name="description" content="Book Details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CommonLayout headerProps={{ hideMenu: true }}>
        <BookInfoSection book={bookData} />
        <BookReviewsSection />
      </CommonLayout>
    </>
  );
};

export default Book;