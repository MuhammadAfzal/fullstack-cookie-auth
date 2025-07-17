// scripts/fixOldUsers.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.user.updateMany({
    where: {
      role: undefined,
    },
    data: {
      role: "ADMIN", // or "ADMIN" if needed
    },
  });

  console.log(`Updated ${updated.count} users.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
