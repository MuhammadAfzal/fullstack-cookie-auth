declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        bio?: string;
        avatar?: string;
        phone?: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}
export {};
