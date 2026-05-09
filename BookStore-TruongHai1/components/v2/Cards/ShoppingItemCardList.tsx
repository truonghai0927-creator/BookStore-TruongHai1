import * as React from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import ShoopingItemCard from 'components/v2/Cards/ShoppingItemCard';
import { homePageBookSumState } from 'atoms';
import { homePageQuery } from 'selectors';

export interface BookListProps {
  page: number;
  pageSize: number;
}

export default function BookList(props: BookListProps) {
  const { page, pageSize } = props;
  const bookListLoadable = useRecoilValueLoadable(homePageQuery);
  const [homePageBookSum, setHomePageBookSum] = useRecoilState(homePageBookSumState);

  switch (bookListLoadable.state) {
    case 'hasValue': {
      const data = bookListLoadable.contents;
      const books = data?.content || [];
      const total = data?.total || 0;
      setHomePageBookSum(total);
      
      if (books.length === 0) {
        return (
          <div className="text-center py-16">
            <p className="text-gray-500">No books found</p>
          </div>
        );
      }
      
      return (
        <>
          {total > 0 && (
            <div className='text-sm text-gray-500 pb-4'>
              {`${pageSize * (page - 1) + 1} ~ ${
                pageSize * page > total ? total : pageSize * page
              } of over ${total} results`}
            </div>
          )}
          <div className='grid grid-cols-1 gap-x-2 gap-y-10 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8'>
            {books.map((book: any) => (
              <ShoopingItemCard key={book.id} {...book} />
            ))}
          </div>
        </>
      );
    }
    case 'loading':
      return (
        <div className='flex items-center justify-center py-16'>
          <span className='loading loading-bars loading-lg'></span>
        </div>
      );
    case 'hasError':
      return (
        <div className="text-center py-16">
          <p className="text-red-500">Error loading books</p>
        </div>
      );
  }
}