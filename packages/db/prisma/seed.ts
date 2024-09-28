import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const alice =  await prisma.user.update({
    where: { number: '7038375956' },
    data: {
      name:"nadeem",
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "122",
          provider: "HDFC Bank",
        },
      },
    },
  });
  const bob = await prisma.user.update({
    where: { number: '9096734685' },
    data: {
      name:"farida",
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 2000,
          token: "123",
          provider: "HDFC Bank",
        },
      },
    },
   
  })
  console.log({ alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })