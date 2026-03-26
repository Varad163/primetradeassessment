import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // optional (remove in production)
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}