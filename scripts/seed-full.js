const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const { TIDB_USER, TIDB_PASSWORD, TIDB_HOST, TIDB_PORT, TIDB_DB_NAME = 'bookshop', DATABASE_URL } = process.env;
const SSL_FLAGS = 'pool_timeout=60&sslaccept=strict';
const databaseURL = DATABASE_URL
  ? `${DATABASE_URL}${DATABASE_URL.includes('?') ? '&' : '?'}${SSL_FLAGS}`
  : `mysql://${TIDB_USER}:${TIDB_PASSWORD}@${TIDB_HOST}:${TIDB_PORT}/${TIDB_DB_NAME}?${SSL_FLAGS}`;

const prisma = new PrismaClient({ datasources: { db: { url: databaseURL } } });

async function main() {
  console.log('DATABASE_URL prefix:', DATABASE_URL ? DATABASE_URL.slice(0, 60) : 'N/A');
  await prisma.$connect();

  const [bCount, aCount, rCount, uCount] = await Promise.all([
    prisma.book.count(),
    prisma.author.count(),
    prisma.rating.count(),
    prisma.user.count(),
  ]);
  console.log(`\nCurrent state → books: ${bCount}, authors: ${aCount}, ratings: ${rCount}, users: ${uCount}`);

  if (bCount === 0) {
    console.log('\n→ Books table is empty — running full seed...');
    const authors = await seedAuthors(20);
    const books   = await seedBooks(100);
    await seedBooksAndAuthors(books, authors);
    await seedRatings(books);
    console.log('\n✅ Full seed completed!');
  } else {
    console.log('\n→ Books already exist — seeding skipped.');
  }

  const [b2, a2, r2] = await Promise.all([
    prisma.book.count(), prisma.author.count(), prisma.rating.count(),
  ]);
  console.log(`\nFinal state → books: ${b2}, authors: ${a2}, ratings: ${r2}`);
}

async function seedAuthors(num) {
  const records = Array.from({ length: num }, (_, i) => ({
    id:         i + 1,
    name:       faker.name.fullName(),
    gender:     faker.datatype.boolean(),
    birthYear:  faker.datatype.number({ min: 1900, max: 2000 }),
    deathYear:  Math.random() > 0.5 ? faker.datatype.number({ min: 2020, max: 2080 }) : null,
  }));
  const { count } = await prisma.author.createMany({ data: records, skipDuplicates: true });
  console.log(`seedAuthors:  inserted ${count} records`);
  // Return all records (not just count) so callers can use them
  return (await prisma.author.findMany({ take: num, orderBy: { id: 'asc' } }));
}

async function seedBooks(num) {
   const bookTypes = ['FICTION', 'NON_FICTION', 'SCIENCE', 'TECHNOLOGY', 'HISTORY', 'BIOGRAPHY'];
  const records = Array.from({ length: num }, (_, i) => {
    const randomType = bookTypes[Math.floor(Math.random() * bookTypes.length)];
    const randomDate = new Date(2000 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    return {
      id:         i + 1,
      title:      faker.lorem.sentence(Math.floor(Math.random() * 4) + 2).replace(/[\.!?]$/, ''),
      type:       randomType,
      publishedAt: randomDate,
      stock:      Math.floor(Math.random() * 200),
      price:      +(Math.random() * 200 + 5).toFixed(2),
    };
  });
  const { count } = await prisma.book.createMany({ data: records, skipDuplicates: true });
  console.log(`seedBooks:    inserted ${count} records`);
  return (await prisma.book.findMany({ take: num, orderBy: { id: 'asc' } }));
}

async function seedBooksAndAuthors(books, authors) {
  if (!books.length || !authors.length) return;
  const records = books.map(b => ({
    bookId:  b.id,
    authorId: authors[Math.floor(Math.random() * authors.length)].id,
  }));
  const { count } = await prisma.bookAuthor.createMany({ data: records, skipDuplicates: true });
  console.log(`seedBooksAuthors: inserted ${count} records`);
}

async function seedRatings(books) {
  const users = await prisma.user.findMany({ select: { id: true } });
  if (!books.length || !users.length) { console.log('seedRatings: skipped (no books or users)'); return; }
  let total = 0;
  for (const book of books) {
    const n = Math.floor(Math.random() * 20) + 5;
    const records = Array.from({ length: n }, () => ({
      bookId:  book.id,
      userId:  users[Math.floor(Math.random() * users.length)].id,
      score:   Math.floor(Math.random() * 5) + 1,
      ratedAt: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    }));
    const { count } = await prisma.rating.createMany({ data: records, skipDuplicates: true });
    total += count;
  }
  console.log(`seedRatings:  inserted ${total} records`);
}

main()
  .catch(e => { console.error('Fatal:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
