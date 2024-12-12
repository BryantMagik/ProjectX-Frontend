import { User } from "./user.interface";
export interface Comment {
    id?: string;
    body: string;
    date?:string;
    updateAt?:string;
    taskId?: string;
    issueId?: string;
    author?:User;
    authorId?: string;
  }
  