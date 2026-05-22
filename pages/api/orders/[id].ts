import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const orderByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
          items: {
            include: {
              book: true
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(order);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default orderByIdHandler;