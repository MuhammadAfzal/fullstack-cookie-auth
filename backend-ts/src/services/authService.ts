import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = 10;

export async function register({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
      },
    });
    return user;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error("Username already exists.");
    }
    throw err; // Unknown error
  }
}

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError("Invalid credentials");
  }
  return jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "1d",
  });
}

export async function getProfile(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new UnauthorizedError("User not found");
    return { id: user.id, username: user.username };
  } catch {
    throw new UnauthorizedError("Invalid token");
  }
}
