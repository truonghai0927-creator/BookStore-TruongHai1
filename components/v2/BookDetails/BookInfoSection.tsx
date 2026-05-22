import * as React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { HomeIcon, StarIcon, ShoppingCartIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useSnackbar } from 'notistack';

import { BookDetailProps, starLabels } from 'const';
import { currencyFormat, roundHalf } from 'lib/utils';
import BookInfoDialog from 'components/v2/BookDetails/BookInfoDialog';
import { shoppingCartState } from 'atoms';
import { useRecoilState } from 'recoil';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-2 text-gray-600 dark:text-gray-400">{starLabels[roundHalf(rating)]}</span>
    </div>
  );
}

interface BookInfoSectionProps {
  book: any;
}

export default function BookInfoSection({ book }: BookInfoSectionProps) {
  const [bookDetailsState, setBookDetailsState] = React.useState<BookDetailProps | undefined>(book);
  const editBookDetailDialogRef = React.useRef<HTMLDialogElement>(null);
  const [shoppingCart, setShoppingCart] = useRecoilState(shoppingCartState);
  const { enqueueSnackbar } = useSnackbar();

  const data = bookDetailsState || book;

  const handleUpdate = (updatedData: BookDetailProps) => {
    setBookDetailsState(updatedData);
  };

  const handleAddToCart = (bookData: BookDetailProps) => {
    const existingItem = shoppingCart.find((item) => item.id === bookData.id);
    if (existingItem) {
      if (existingItem.quantity >= bookData.stock) {
        enqueueSnackbar('Out of stock!', { variant: 'error' });
        return;
      }
      setShoppingCart(
        shoppingCart.map((item) =>
          item.id === bookData.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setShoppingCart([
        ...shoppingCart,
        {
          id: bookData.id,
          title: bookData.title,
          type: bookData.type,
          price: bookData.price,
          publishedAt: bookData.publishedAt,
          stock: bookData.stock,
          authors: [],
          averageRating: 0,
          ratings: 0,
          quantity: 1,
        },
      ]);
    }
    enqueueSnackbar(`"${bookData.title}" added to cart`, { variant: 'success' });
  };

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Book Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The book you're looking for doesn't exist.</p>
        <NextLink href="/" className="text-purple-600 hover:text-purple-700 font-medium">
          Go back to home
        </NextLink>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <NextLink href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <HomeIcon className="w-4 h-4" />
        </NextLink>
        <span>/</span>
        <span className="text-gray-800 dark:text-white font-medium truncate">{data.title}</span>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-950 overflow-hidden transition-colors duration-300">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Book Image */}
          <div className="flex justify-center">
            <div className="relative w-64 h-80 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={`https://picsum.photos/seed/${data.id}/400/600`}
                alt={data.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="flex flex-col gap-4">
            {/* Type Badge */}
            <div>
              <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-full">
                {data.type.replaceAll('_nbsp_', ' ').replaceAll('_amp_', '&')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {data.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <StarRating rating={data.averageRating || 0} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({data.ratings || 0} reviews)
              </span>
            </div>

            {/* Publication Date */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <CalendarIcon className="w-5 h-5" />
              <span>Published: {data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : 'N/A'}</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              ${currencyFormat(data.price)}
            </div>

            {/* Stock */}
            <div className={`text-lg font-medium ${data.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
              {data.stock > 0 ? `${data.stock} in stock` : 'Out of stock'}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5"
                onClick={() => handleAddToCart(data)}
                disabled={data.stock === 0}
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {data.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {data && (
        <BookInfoDialog
          key={`${data.id}-${data.stock}`}
          id="edit_book_detail"
          ref={editBookDetailDialogRef}
          data={data}
          onSuccess={handleUpdate}
        />
      )}
    </>
  );
}