import { Role } from "../constants/roles";

export interface User {
  id: number;
  username: string;
  role: Role;
}
