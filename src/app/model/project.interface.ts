import { Task } from "./task.interface";
import { User } from "./user.interface"

export interface Participant {
    name: any;
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  }
  export interface Author {
    id: string;
    name: string; 
  }
export interface Project {
    id: string
    workspaceId:string
    code: string
    name: string
    description: string
    status: string
    type: string
    userId: string
    author: User
    participants: Participant[];
    authors: Author[];
    createdAt: string,
    updatedAt: string,
    image?: string
    tasks: Task
}