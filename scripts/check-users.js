const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, name: true, role: true }
  });
  console.log('Users in database:', users);
  await prisma.$disconnect();
}

main();
