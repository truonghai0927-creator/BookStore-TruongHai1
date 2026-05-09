import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

import { useRecoilState } from 'recoil';
import { shoppingCartState, currentUserIdState } from 'atoms';

import { shoppingCartItemProps } from 'const';
import { currencyFormat, calcCartItemTotalPrice } from 'lib/utils';
import { buyBook } from 'lib/http';

export default function ShoppingCartListItem(props: shoppingCartItemProps) {
  const {
    id,
    title,
    authors,
    type,
    price,
    averageRating,
    quantity,
    stock,
    publishedAt,
  } = props;
  const [loading, setLoading] = React.useState(false);

  const [shoppingCart, setShoppingCart] = useRecoilState(shoppingCartState);
  const [currentUserId] = useRecoilState(currentUserIdState);

  const { enqueueSnackbar } = useSnackbar();

  const authorName = authors.map(a => a.author.name).join(', ') || 'Unknown Author';
  const formattedPrice = typeof price === 'string' ? Number(price).toFixed(2) : price;
  const itemTotal = typeof price === 'string' ? (Number(price) * quantity).toFixed(2) : (price * quantity);

  function handleAddQty() {
    setShoppingCart((oldShoppingCart) => {
      return oldShoppingCart.reduce<shoppingCartItemProps[]>((prev, item) => {
        if (item.id === id) {
          prev.push({
            ...item,
            quantity: quantity + 1,
          });
        } else {
          prev.push(item);
        }
        return prev;
      }, []);
    });
  }

  function handleRemoveQty() {
    setShoppingCart((oldShoppingCart) => {
      return oldShoppingCart.reduce<shoppingCartItemProps[]>((prev, item) => {
        if (item.id === id) {
          prev.push({
            ...item,
            quantity: quantity - 1,
          });
        } else {
          prev.push(item);
        }
        return prev;
      }, []);
    });
  }

  function deleteItem() {
    setShoppingCart((oldShoppingCart) => {
      return [...oldShoppingCart.filter((i) => i.id !== id)];
    });
    enqueueSnackbar(`"${title}" removed from cart`, { variant: 'success' });
  }

  const handleBuyClick = async () => {
    setLoading(true);
    const response = await buyBook(id, {
      userID: currentUserId,
      quality: quantity,
    });
    if (response.error) {
      enqueueSnackbar(`Error: ${response.error}.`, {
        variant: 'error',
      });
      setLoading(false);
      return;
    }
    enqueueSnackbar(`${response.content?.message}`, {
      variant: 'success',
    });
    setLoading(false);
    setShoppingCart((oldShoppingCart) => {
      return oldShoppingCart.filter((i) => i.id !== id);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="flex gap-4 p-4">
        {/* Image */}
        <Link href={`/book/${id}`} className="flex-shrink-0">
          <div className="relative w-24 h-36 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={`https://picsum.photos/seed/${id}/200/300`}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link href={`/book/${id}`}>
            {/* Title */}
            <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </Link>

          {/* Author */}
          <p className="text-sm text-gray-500 mb-2">
            {authorName}
          </p>

          {/* Price */}
          <p className="text-lg font-bold text-blue-600 mb-3">
            ${formattedPrice}
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
                onClick={handleRemoveQty}
              >
                <MinusIcon className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-10 text-center font-medium text-gray-800">
                {quantity}
              </span>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={quantity >= stock}
                onClick={handleAddQty}
              >
                <PlusIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-lg font-bold text-gray-800">
                ${itemTotal}
              </p>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={deleteItem}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Remove item"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          {quantity === 1 ? `(${quantity} item)` : `(${quantity} items)`}
        </p>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleBuyClick}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <ShoppingCartIcon className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">Buy Now</span>
        </button>
      </div>
    </div>
  );
}