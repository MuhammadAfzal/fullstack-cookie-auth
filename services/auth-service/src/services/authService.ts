import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { Role, AuthUser } from "@shared/common";
import {
  AuthenticationError,
  ConflictError,
  BadRequestError,
} from "@shared/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = 10;

interface AuthData {
  username: string;
  password: string;
  role?: Role;
}

// 🔐 Register User
export async function register({
  username,
  password,
  role = Role.USER,
}: AuthData) {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        role,
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
    throw new AuthenticationError("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    {
      expiresIn: "1d",
    }
  );

  return token;
}

// 👤 Get Profile by Token
export async function getProfile(token: string): Promise<AuthUser> {
  try {
    const decoded = jwt.verify(token, SECRET) as { id: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    if (!user) throw new AuthenticationError("User not found");
    return {
      id: user.id,
      username: user.username,
      role: user.role as any,
    };
  } catch {
    throw new AuthenticationError("Invalid token");
  }
}
