import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { Role } from "../constants/roles";

const prisma = new PrismaClient();

const ROLES: Role[] = [Role.USER, Role.ADMIN, Role.MODERATOR, Role.SUPER_ADMIN];
const NUM_USERS = 2000; // Adjust for more/less users

async function main() {
  console.log(`Seeding ${NUM_USERS} users...`);
  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const username = faker.internet.userName().toLowerCase() + i;
    const password = faker.internet.password({ length: 12 });
    const role = faker.helpers.arrayElement(ROLES);
    // Random date in the last 6 months
    const createdAt = faker.date.between({
      from: faker.date.recent({ days: 180 }),
      to: new Date(),
    });
    users.push({ username, password, role, createdAt });
  }

  // Delete all users except the first admin (id=1) for a clean slate
  await prisma.user.deleteMany({ where: { id: { gt: 1 } } });

  // Bulk create users
  await prisma.user.createMany({ data: users });
  console.log(`Seeded ${users.length} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
