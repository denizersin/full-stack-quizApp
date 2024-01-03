import { PrismaClient } from '@prisma/client'
import { mockCreate, test2 } from './createMockData'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


// mockCreate()
// test2();
// async function name() {
//   const d=await  prisma.quiz.update({
//         where: {
//             id: 4
//         },
//         data: {
//             title: 'dc'
//         }
//     })

//     console.log(d);
//     console.log('*************');
// }

// name()