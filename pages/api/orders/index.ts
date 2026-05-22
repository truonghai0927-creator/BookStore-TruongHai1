import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const orderHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  if (req.method === 'POST') {
    try {
      const { customerName, email, phone, address, items } = req.body;

      if (!customerName || !items || items.length === 0) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const totalPrice = items.reduce((sum: number, item: any) => 
        sum + Number(item.price) * item.quantity, 0
      );

      const order = await prisma.order.create({
        data: {
          customerName,
          email,
          phone,
          address,
          totalPrice,
          items: {
            create: items.map((item: any) => ({
              bookId: Number(item.id),
              quantity: item.quantity,
              price: Number(item.price)
            }))
          }
        },
        include: {
          items: true
        }
      });

      res.status(201).json(order);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'GET') {
    try {
      const orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              book: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(orders);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default orderHandler;