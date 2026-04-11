import { selector } from "recoil";
import { bookDetailsIdState, homePageQueryState } from "atoms";
import {
  fetchBookDetailsById,
  fetchBookRatingsById,
  fetchBooks,
} from "lib/http";

export const homePageQuery = selector({
  key: "homePage",
  get: async ({ get }) => {
    const { page, size, type, sort } = get(homePageQueryState);
    const response = await fetchBooks({ page, size, type, sort });
    return { content: response.books, total: response.total };
  },
});

export const bookInfoQuery = selector({
  key: "BookInfoQuery",
  get: async ({ get }) => {
    const bookID = get(bookDetailsIdState);
    
    if (!bookID) {
      return { content: null };
    }
    
    const response = await fetchBookDetailsById(bookID);
    return response;
  },
});

export const bookRatingQuery = selector({
  key: "BookRatingQuery",
  get: async ({ get }) => {
    const bookID = get(bookDetailsIdState);
    if (!bookID) {
      return { content: { content: [], total: 0 } };
    }
    const response = await fetchBookRatingsById(bookID);
    return response;
  },
});