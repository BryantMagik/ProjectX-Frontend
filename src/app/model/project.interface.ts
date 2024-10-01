import { User } from "./user.interface"

export interface Participant {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  }

export interface Project {
    id: string
    code: string
    name: string
    description: string
    status: string
    type: string
    userId: string
    author: User
    participants: Participant[];
    createdAt: string
    updatedAt: string
}