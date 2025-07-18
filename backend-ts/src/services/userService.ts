import { prisma } from "../db";
import redis from "../utils/redisClient";

export async function getUserProfile(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      role: true,
      email: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatar: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getAllUsers({
  skip = 0,
  take = 50,
}: {
  skip?: number;
  take?: number;
}) {
  const cacheKey = `users:${skip}:${take}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      orderBy: { id: "asc" },
      select: {
        id: true,
        username: true,
        role: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count(),
  ]);
  const result = { users, total };
  await redis.set(cacheKey, JSON.stringify(result), "EX", 30); // 30 seconds
  return result;
}
