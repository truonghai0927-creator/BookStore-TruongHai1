import axios from 'axios';
import { BookProps, BookDetailProps, BookRatingsProps } from 'const';

// Create axios instance with defaults
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// ============ BOOKS ============

export async function fetchBooks(options: {
  page?: number;
  size?: number;
  type?: string;
  sort?: string;
} = {}): Promise<{ books: BookProps[]; total: number; error?: string }> {
  try {
    const params = new URLSearchParams();
    if (options.page) params.set('page', String(options.page));
    if (options.size) params.set('size', String(options.size));
    if (options.type) params.set('type', options.type);
    if (options.sort) params.set('sort', options.sort);
    
    const response = await api.get(`/books?${params.toString()}`);
    return { books: response.data.content || [], total: response.data.total || 0 };
  } catch (error: any) {
    console.error('fetchBooks error:', error);
    return { books: [], total: 0, error: error.message };
  }
}

export async function fetchBookDetailsById(id: string): Promise<{
  content: BookDetailProps | null;
  error?: string;
}> {
  try {
    const response = await api.get(`/books/${id}`);
    
    if (response.status === 404) {
      return { content: null, error: 'Book not found' };
    }
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch book');
    }
    
    return { content: response.data as BookDetailProps };
  } catch (error: any) {
    console.error('fetchBookDetailsById error:', error);
    return { content: null, error: error.message };
  }
}

export async function fetchBookById(id: string): Promise<{ book: BookDetailProps | null; error?: string }> {
  const result = await fetchBookDetailsById(id);
  return { book: result.content, error: result.error };
}

export async function fetchBookTypes(): Promise<{ types: string[]; error?: string }> {
  try {
    const response = await api.get('/books/types');
    return { types: response.data || [] };
  } catch (error: any) {
    console.error('fetchBookTypes error:', error);
    return { types: [], error: error.message };
  }
}

export async function updateBookDetails(
  id: string,
  params: Partial<BookDetailProps>
): Promise<{
  content?: { data: BookDetailProps; message: string };
  error?: string;
}> {
  try {
    const response = await api.put(`/books/${id}`, params);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return { content: response.data };
  } catch (error: any) {
    console.error('updateBookDetails error:', error);
    return { error: error.message };
  }
}

// ============ RATINGS ============

export async function fetchBookRatingsById(id: string): Promise<{
  content: { content: BookRatingsProps[]; total: number };
  error?: string;
}> {
  try {
    const response = await api.get(`/books/${id}/ratings`);
    return { content: response.data };
  } catch (error: any) {
    console.error('fetchBookRatingsById error:', error);
    return { content: { content: [], total: 0 }, error: error.message };
  }
}

export async function fetchBookRatings(bookId: string): Promise<{ ratings: BookRatingsProps[]; error?: string }> {
  try {
    const response = await api.get(`/books/${bookId}/ratings`);
    return { ratings: response.data.content || [] };
  } catch (error: any) {
    console.error('fetchBookRatings error:', error);
    return { ratings: [], error: error.message };
  }
}

export async function addRatingByBookID(
  bookID: string,
  params: { score: number }
): Promise<{
  content?: { data: Omit<BookRatingsProps, 'user'>; message: string };
  error?: string;
}> {
  try {
    const response = await api.post(`/books/${bookID}/ratings`, params);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return { content: response.data };
  } catch (error: any) {
    console.error('addRatingByBookID error:', error);
    return { error: error.message };
  }
}

export async function addRating(bookId: string, score: number): Promise<{ message?: string; error?: string }> {
  try {
    const response = await api.post(`/books/${bookId}/ratings`, { score });
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return { message: response.data.message };
  } catch (error: any) {
    console.error('addRating error:', error);
    return { error: error.message };
  }
}

export async function deleteRating(
  bookID: string,
  userID: string
): Promise<{
  content?: { message: string };
  error?: string;
}> {
  try {
    const response = await api.delete(
      `/books/${bookID}/ratings?userId=${userID}`
    );
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return { content: response.data };
  } catch (error: any) {
    console.error('deleteRating error:', error);
    return { error: error.message };
  }
}

// ============ CART / ORDERS ============

export async function buyBook(
  bookID: string,
  params: { userID: string; quality: number }
): Promise<{
  content?: { message: string };
  error?: string;
}> {
  try {
    const response = await api.post(
      `/books/${bookID}/buy?userId=${params.userID}&quality=${params.quality}`
    );
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return { content: response.data };
  } catch (error: any) {
    console.error('buyBook error:', error);
    return { error: error.message };
  }
}