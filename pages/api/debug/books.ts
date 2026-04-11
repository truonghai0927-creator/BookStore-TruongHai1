import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get all books with IDs
    const books = await prisma.book.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        stock: true,
      },
      orderBy: { id: 'asc' },
      take: 50, // Limit to 50 books
    });

    res.status(200).json({
      books,
      total: books.length,
      message: 'Use these IDs to test /api/books/{id}',
    });
  } catch (error: any) {
    console.error('Debug API Error:', error);
    res.status(500).json({ 
      message: error.message,
      stack: error.stack,
    });
  }
}