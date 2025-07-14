import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  UnauthorizedError,
  ConflictError,
  BadRequestError,
} from "../utils/AppError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = 10;

interface AuthData {
  username: string;
  password: string;
}

// 🔐 Register User
export async function register({ username, password }: AuthData) {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
      },
    });

    return {
      id: user.id,
      username: user.username,
    };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ConflictError("Username already exists.");
    }

    throw new BadRequestError("Registration failed.");
  }
}

// 🔓 Login User
export async function login({ username, password }: AuthData) {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "1d",
  });

  return token;
}

// 👤 Get Profile by Token
export async function getProfile(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) throw new UnauthorizedError("User not found");

    return {
      id: user.id,
      username: user.username,
    };
  } catch {
    throw new UnauthorizedError("Invalid token");
  }
}
