import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import { BookProps } from '../const';

interface BookCardProps extends BookProps {
  onAddToCart?: (book: BookProps) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">({rating.toFixed(1)})</span>
    </div>
  );
}

export default function BookCard({ id, title, type, price, averageRating = 0, authors, stock, onAddToCart }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatType = type.replaceAll('_nbsp_', ' ').replaceAll('_amp_', '&');
  const authorName = authors.map(a => a.author.name).join(', ') || 'Unknown Author';
  const formattedPrice = typeof price === 'string' ? Number(price).toFixed(2) : price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.({
      id,
      title,
      type,
      publishedAt: '',
      price,
      averageRating,
      authors,
      stock,
      ratings: 0,
    });
  };

  return (
    <div
      className={`
        group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md dark:shadow-gray-950 transition-all duration-300
        ${isHovered ? 'shadow-lg scale-[1.02]' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/book/${id}`}>
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
          {!imageError ? (
            <Image
              src={`https://picsum.photos/seed/${id}/400/300`}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-gray-700">
              <span className="text-5xl">📚</span>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              {formatType}
            </span>
          </div>

          {/* Quick Add Button */}
          <div className={`
            absolute bottom-3 right-3 transition-all duration-300
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}>
            <button
              onClick={handleAddToCart}
              disabled={stock === 0}
              className={`
                p-3 rounded-full transition-all duration-200
                ${stock === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }
              `}
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {stock === 0 && (
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h3>

          {/* Author */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
            {authorName}
          </p>

          {/* Rating */}
          <div className="mb-3">
            <StarRating rating={averageRating || 0} />
          </div>

          {/* Price & Stock */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              ${formattedPrice}
            </span>
            <span className={`text-sm ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {stock > 0 ? `${stock} in stock` : 'Unavailable'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}