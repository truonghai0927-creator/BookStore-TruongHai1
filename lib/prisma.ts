import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

const { TIDB_USER, TIDB_PASSWORD, TIDB_HOST, TIDB_PORT, TIDB_DB_NAME = 'bookshop', DATABASE_URL } = process.env;
// Notice: When using TiDB Cloud Serverless Tier, you MUST enable TLS by setting sslaccept=strict.
// See: https://docs.pingcap.com/developer/serverless-driver-prisma-example/
let databaseURL: string;
if (DATABASE_URL) {
  databaseURL = DATABASE_URL;
} else {
  const SSL_FLAGS = 'pool_timeout=60&sslaccept=strict';
  databaseURL = `mysql://${TIDB_USER}:${TIDB_PASSWORD}@${TIDB_HOST}:${TIDB_PORT}/${TIDB_DB_NAME}?${SSL_FLAGS}`;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseURL,
      },
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseURL,
        },
      },
    });
  }
  prisma = global.prisma
}

export default prisma
