import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma'

interface BuyResult {
  status: number;
  message: string;
  data: {
    userId: number;
    bookId: number;
    bookTitle: string;
    cost: number;
    remaining: number;
    orderId: number;
  };
}

const buyBookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<BuyResult['data'] | { message: string }>
) => {
  if (req.method === 'POST') {
    try {
        const result = await buyBook(req);
        res.status(result.status).json(result.data);
    } catch (err:any) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}

// ── Minimal inline JWT helpers (avoids dynamic import through [id] route which TS
//    cannot resolve with bad bracket-glob). Full logic is identical to lib/auth.ts.
const JWT_ALGO = 'HS256';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyToken(token: string): { id: number; email: string; name: string } | null {
  try {
    const payload = require('jsonwebtoken').verify(token, JWT_SECRET) as {
      user: { id: number; email: string; name: string },
    };
    return payload.user;
  } catch {
    return null;
  }
}

async function buyBook(req: NextApiRequest): Promise<BuyResult> {
    // ── Validate query params ──
    if (typeof req.query.id !== 'string' && typeof req.query.id !== 'number') {
        throw new Error('Invalid parameter `id`.');
    }
    const bookId = Number(req.query.id);

    if (typeof req.query.quality !== 'string' && typeof req.query.quality !== 'number') {
        throw new Error('Invalid parameter `quality`.');
    }
    const quality = Math.floor(Number(req.query.quality));
    if (quality <= 0) {
        throw new Error('Parameter `quality` must be greater than zero.');
    }

    // ── Get authenticated user from JWT header ──
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('You must be logged in to buy a book.');
    }
    const token = authHeader.replace('Bearer ', '');
    const userPayload = verifyToken(token);
    if (!userPayload) {
        throw new Error('Invalid or expired token. Please log in again.');
    }
    const userId = userPayload.id;

    try {
        const result = await prisma.$transaction(async tx => {
            // 1. Find the book
            const book = await tx.book.findUnique({
                where: { id: bookId },
            });
            if (!book) {
                throw new Error(`Book <id: ${bookId}> not found.`);
            }

            // 2. Check stock
            if (quality > book.stock) {
                throw new Error(`Only ${book.stock} copies left of "${book.title}".`);
            }

            // 3. Compute cost (Decimal × int → Decimal, then to JS number)
            const cost = parseFloat(book.price.toFixed(2)) * quality;

            // 4. Deduct user balance
            const purchaser = await tx.user.update({
                data: {
                    balance: { decrement: cost },
                },
                where: { id: userId },
            });
            if (purchaser.balance.toNumber() < 0) {
                throw new Error(
                    `Insufficient balance. You need ${cost} but have ${
                        parseFloat(purchaser.balance.toFixed(2)) + cost
                    }.`
                );
            }

            // 5. Update stock
            await tx.book.update({
                data: { stock: { decrement: quality } },
                where: { id: bookId },
            });

            // 6. Create Order + OrderItem
            //    Use nested relation writes so the "checked" OrderCreateInput type works.
            //    `user: { connect }` satisfies OrderCreateInput ∋ user | items
            //    `items: { create }` writes the OrderItem row via the Order→items relation.
            const order = await tx.order.create({
                data: {
                    customerName: userPayload.name,
                    email: userPayload.email,
                    totalPrice: cost,
                    user: {
                        connect: { id: userId },
                    },
                    items: {
                        create: [
                            {
                                bookId,
                                quantity: quality,
                                price: book.price,
                            },
                        ],
                    },
                },
                include: {
                    items: { include: { book: true } },
                },
            });

            return {
                status: 200,
                message: `Successfully bought ${quality} × "${
                    book.title
                }" for ${cost}. Remaining balance: ${parseFloat(purchaser.balance.toFixed(2))}`,
                data: {
                    userId,
                    bookId,
                    bookTitle: book.title,
                    cost,
                    remaining: parseFloat(purchaser.balance.toFixed(2)),
                    orderId: order.id,
                },
            };
        });
        return result;
    } catch(err: any) {
        console.error(err);
        return {
            status: 500,
            message: `Failed to buy book ${bookId}: ${err.message}`,
            data: {
                userId: 0,
                bookId,
                bookTitle: '',
                cost: 0,
                remaining: 0,
                orderId: 0,
            },
        };
    }
}

export default buyBookHandler;
