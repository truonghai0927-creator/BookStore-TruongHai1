import * as React from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { PlusIcon } from '@heroicons/react/24/solid';

import { bookDetailsIdState } from 'atoms';
import { bookRatingQuery } from 'selectors';
import { BookRatingsProps, starLabels } from 'const';
import { roundHalf } from 'lib/utils';
import HalfRating from 'components/v2/Rating/HalfRating';
import BookRatingDeleteDialog from 'components/v2/BookDetails/BookRatingDeleteDialog';
import BookAddRatingDialog from 'components/v2/BookDetails/BookAddRatingDialog';

// ─── Helper: safe avatar letter ────────────────────────────────────────────────
function getAvatarLetter(review: BookRatingsProps): string {
  const nickname = review.user?.nickname;
  if (!nickname) return 'U';
  const first = nickname.trim().charAt(0);
  return first ? first.toUpperCase() : 'U';
}

// ─── Helper: safe display name ────────────────────────────────────────────────
function getDisplayName(review: BookRatingsProps): string {
  const nickname = review.user?.nickname;
  return nickname && nickname.trim() ? nickname.trim() : 'Unknown User';
}

// ─── Utility bar ──────────────────────────────────────────────────────────────
function StarPercentageBar({ leftText, value }: { leftText?: string; value: number }) {
  const valueRound = Math.round(value);
  return (
    <div className="flex items-center gap-2">
      {leftText && <span className="text-sm text-gray-500 w-12">{leftText}</span>}
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-300"
          style={{ width: `${valueRound}%` }}
        />
      </div>
      <span className="text-sm text-gray-500 w-8">{valueRound}%</span>
    </div>
  );
}

// ─── Safe Review Card ─────────────────────────────────────────────────────────
interface ReviewCardProps {
  review: BookRatingsProps;
  onDelete: () => void;
}

function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const displayName = getDisplayName(review);
  const avatarLetter = getAvatarLetter(review);
  const initialChar = avatarLetter;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {initialChar}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name and Rating */}
          <div className="flex items-center justify-between mb-2">
            <div>
              {/* user may be null — guarded by getDisplayName */}
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                {displayName}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                User ID: {String(review.user?.id ?? review.userId)}
              </p>
            </div>
            <HalfRating disabled rating={review.score} />
          </div>

          {/* Date */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {new Date(review.ratedAt).toLocaleDateString()}
          </p>

          {/* Delete Button */}
          <button
            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function BookReviewsSection() {
  const addRatingDialogRef = React.useRef<HTMLDialogElement>(null);
  const [targetUserId, setTargetUserId] = React.useState<string | null>(null);
  const deleteDialogRef = React.useRef<HTMLDialogElement>(null);

  const bookRatingLoadable = useRecoilValueLoadable(bookRatingQuery);
  const [bookDetailsId] = useRecoilState(bookDetailsIdState);

  const handleDelete = (userId: string) => () => {
    setTargetUserId(userId);
    deleteDialogRef.current?.showModal();
  };

  switch (bookRatingLoadable.state) {
    case 'hasValue':
      const data = bookRatingLoadable.contents.content.content as BookRatingsProps[] | undefined;

      const reviews = data ?? [];
      const num = reviews.length;
      const sum = num > 0 ? reviews.reduce((prev: number, item: BookRatingsProps) => prev + item.score, 0) : 0;
      const avg = num > 0 ? sum / num : 0;

      return (
        <div className="mt-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Customer Reviews</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors"
              onClick={() => {
                addRatingDialogRef?.current?.showModal();
              }}
            >
              <PlusIcon className="w-5 h-5" />
              Add Review
            </button>
          </div>

          {/* Reviews Overview Card */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Average Rating Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">{avg.toFixed(1)}</div>
              <HalfRating disabled rating={avg} />
              <p className="text-gray-500 dark:text-gray-400 mt-2">{num} global ratings</p>
            </div>

            {/* Rating Bars Card */}
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <StarPercentageBar
                    key={star}
                    leftText={`${star} Star`}
                    value={
                      num > 0
                        ? (reviews.filter((i: BookRatingsProps) => i.score === star).length / num) * 100
                        : 0
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((item: BookRatingsProps) => (
                <ReviewCard
                  key={`${item.bookId}-${item.userId}-${item.ratedAt}`}
                  review={item}
                  onDelete={handleDelete(item.userId)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
            </div>
          )}

          <BookAddRatingDialog
            bookId={bookDetailsId}
            ref={addRatingDialogRef}
          />

          {targetUserId && (
            <BookRatingDeleteDialog
              bookId={bookDetailsId}
              userId={targetUserId}
              ref={deleteDialogRef}
            />
          )}
        </div>
      );

    case 'loading':
      return (
        <div className="flex items-center justify-center py-20">
          <span className="loading loading-bars loading-lg text-purple-600"></span>
        </div>
      );

    case 'hasError':
      return (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 dark:text-gray-400">Failed to load reviews.</p>
        </div>
      );
  }
}