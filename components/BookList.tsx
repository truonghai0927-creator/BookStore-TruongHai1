import BookCard from './BookCard';
import { BookProps } from '../const';

interface BookListProps {
  books: BookProps[];
  onAddToCart?: (book: BookProps) => void;
}

export default function BookList({ books, onAddToCart }: BookListProps) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
        <p className="text-gray-500">We couldn't find any books matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {books.map((book) => (
        <BookCard key={book.id} {...book} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}