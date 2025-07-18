import { prisma } from "../db";

export async function getUserProfile(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, role: true, createdAt: true },
  });
}

export async function getAllUsers({
  skip = 0,
  take = 50,
}: {
  skip?: number;
  take?: number;
}) {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      orderBy: { id: "asc" },
      select: { id: true, username: true, role: true, createdAt: true },
    }),
    prisma.user.count(),
  ]);
  return { users, total };
}
