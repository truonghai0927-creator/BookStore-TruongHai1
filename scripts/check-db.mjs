require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 60) + '...' : 'UNDEFINED');

  // 1. Books count
  const bookCount = await prisma.book.count();
  console.log('\n[1] Books count:', bookCount);

  // 2. Find book with id=1
  const book1 = await prisma.book.findUnique({
    where: { id: 1 },
    include: {
      authors: { include: { author: true } },
    },
  });
  console.log('[2] Book #1:', book1 ? { id: book1.id, title: book1.title, price: book1.price.toString() } : 'NULL (not found)');

  // 3. First 3 books
  const top3 = await prisma.book.findMany({ take: 3 });
  console.log('[3] First 3 books:', top3.map(b => ({ id: b.id, title: b.title })));

  // 4. Users count + table list
  const [userCount, tables] = await Promise.all([
    prisma.user.count(),
    prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name`,
  ]);
  console.log('[4] Users count:', userCount);
  console.log('[5] Tables:', tables.map(t => t.table_name).join(', '));
}

main().catch(e => console.error('Error:', e.message)).finally(() => prisma.$disconnect());
