import { prisma } from "../db";

export async function getUserProfile(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, role: true, createdAt: true },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany({
    select: { id: true, username: true, role: true, createdAt: true },
  });
}
