import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

const DATABASE_URL = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });
  }
  prisma = global.prisma
}

export default prisma