#!/usr/bin/env node
/* Seed 1000 users for user-service */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function pad(num, size) {
  let s = String(num);
  while (s.length < size) s = "0" + s;
  return s;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateWithin(daysBack) {
  const now = new Date();
  const past = new Date(
    now.getTime() - Math.floor(Math.random() * daysBack) * 24 * 60 * 60 * 1000
  );
  return past;
}

async function main() {
  const total = parseInt(process.env.SEED_COUNT || "1000", 10);
  console.log(`Seeding ${total} users into user-service DB ...`);

  const firstNames = [
    "Alex",
    "Sam",
    "Jordan",
    "Taylor",
    "Casey",
    "Drew",
    "Jamie",
    "Morgan",
    "Riley",
    "Quinn",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Brown",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
  ];
  const locations = [
    "NY",
    "SF",
    "LA",
    "SEA",
    "AUS",
    "DAL",
    "MIA",
    "CHI",
    "BOS",
    "DEN",
  ];

  const users = [];
  for (let i = 1; i <= total; i++) {
    const fn = randomChoice(firstNames);
    const ln = randomChoice(lastNames);
    const n = pad(i, 4);
    const createdAt = randomDateWithin(200);
    users.push({
      email: `user${n}@example.com`,
      username: `user_${n}`,
      firstName: fn,
      lastName: ln,
      bio: `Hello, I'm ${fn} ${ln}!`,
      location: randomChoice(locations),
      isActive: true,
      isVerified: Math.random() < 0.3,
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Insert in chunks to avoid exceeding parameter limits
  const chunkSize = 250;
  for (let start = 0; start < users.length; start += chunkSize) {
    const chunk = users.slice(start, start + chunkSize);
    await prisma.user.createMany({ data: chunk, skipDuplicates: true });
    console.log(
      `Inserted ${Math.min(start + chunkSize, users.length)} / ${users.length}`
    );
  }

  console.log("User seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
