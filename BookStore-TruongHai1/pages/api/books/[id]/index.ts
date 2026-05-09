import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

const ALLOW_UPDATE_FIELDS = ['type', 'price', 'stock', 'publishedAt'];

const bookDetailHandler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    switch(req.method) {
        case 'GET':
            try {
                const { book, error } = await getBookDetail(req);
                
                if (error) {
                  console.error('Get book error:', error);
                  res.status(500).json({ message: error });
                  return;
                }
                
                if (!book) {
                    res.status(404).json({ message: 'Book not found' });
                    return;
                }
                
                res.status(200).json(book);
            } catch (err: any) {
                console.error('GET Error:', err);
                res.status(500).json({ message: err.message || 'Internal server error' });
            }
            break;
            
        case 'PUT':
            try {
                await updateBookDetail(req, res);
            } catch (err: any) {
                console.error('PUT Error:', err);
                res.status(500).json({ message: err.message || 'Internal server error' });
            }
            break;
            
        default:
            res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
};

async function getBookDetail(req: NextApiRequest): Promise<{ book: any; error?: string }> {
    // Get id from query
    const idParam = req.query.id;
    
    console.log('Book API - id param:', idParam, typeof idParam);
    
    if (!idParam) {
        return { book: null, error: 'Missing id parameter' };
    }
    
    // Handle string or array
    const idString = Array.isArray(idParam) ? idParam[0] : idParam;
    const bookId = Number(idString);
    
    console.log('Book API - parsed id:', bookId);
    
    if (isNaN(bookId)) {
        return { book: null, error: `Invalid id: "${idString}" is not a valid number` };
    }
    
    if (bookId <= 0) {
        return { book: null, error: `Invalid id: must be greater than 0` };
    }
    
    try {
        // Get book from database
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: {
                authors: {
                    include: {
                        author: true
                    }
                }
            }
        });
        
        console.log('Book API - found book:', book?.id, book?.title);
        
        if (!book) {
            return { book: null, error: undefined };
        }
        
        // Calculate average rating
        const ratingAgg = await prisma.rating.aggregate({
            _avg: { score: true },
            where: { bookId: bookId }
        });
        
        // Return book with average rating
        return {
            book: {
                ...book,
                averageRating: ratingAgg._avg.score || 0
            }
        };
    } catch (err: any) {
        console.error('Database error:', err);
        return { book: null, error: err.message };
    }
}

async function updateBookDetail(req: NextApiRequest, res: NextApiResponse) {
    // Validate id parameter
    const idParam = req.query.id;
    
    if (!idParam) {
        throw new Error('Missing book id parameter');
    }
    
    const bookId = Number(idParam);
    
    if (isNaN(bookId)) {
        throw new Error('Invalid book id: must be a number');
    }
    
    // Check if body exists
    if (!req.body || typeof req.body !== 'object') {
        throw new Error('Invalid request body');
    }
    
    // Build update data (only allow specific fields)
    const updateData: any = {};
    for (const [key, value] of Object.entries(req.body)) {
        if (ALLOW_UPDATE_FIELDS.includes(key)) {
            updateData[key] = value;
        }
    }
    
    // Check if book exists first
    const existingBook = await prisma.book.findUnique({ where: { id: bookId } });
    if (!existingBook) {
        res.status(404).json({ message: 'Book not found' });
        return;
    }
    
    // Update book
    const result = await prisma.book.update({
        data: updateData,
        where: { id: bookId }
    });
    
    res.status(200).json({
        message: 'success',
        data: result
    });
}

export default bookDetailHandler;