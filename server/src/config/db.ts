// @ts-ignore
import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { withAccelerate } from '@prisma/extension-accelerate';
import dotenv from "dotenv";
dotenv.config();

const url = process.env.DATABASE_URL as string;

export const prisma = new PrismaClient({
    log: ['error'],
    // @ts-ignore - In case types haven't updated yet, but Prisma 7 needs this
    accelerateUrl: url,
});
export default prisma;

// const baseClient = new PrismaClient({
//     log: ['error'],
//     // @ts-ignore - In case types haven't updated yet, but Prisma 7 needs this
//     accelerateUrl: url,
// });;

// const extendedClient = baseClient.$extends(withAccelerate());

// const globalForPrisma = globalThis as unknown as {
//     prisma: typeof extendedClient | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? extendedClient;

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


// export const connectDatabase = async () => {
//     try {
//         // Note: With Accelerate, you don't strictly need $connect()
//         // but it's fine to keep for verification
//         await baseClient.$connect();
//         console.log(`
//             ✅ Database connected via Prisma Accelerate
//             🔗 URL: ${url.length > 10 ? url.substring(0, 50) + '...' : url}`);
//     } catch (error) {
//         console.log('❌ Database connection failed:', (error as Error).message);
//         process.exit(1);
//     }
// };

// export const disconnectDatabase = async () => {
//     await baseClient.$disconnect();
//     console.log('📦 Database disconnected');
// };
// export default prisma;
