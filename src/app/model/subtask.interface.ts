import { TASKSSTATUS } from "../types/models";
import { Task } from "./task.interface";
import { User } from "./user.interface";

export interface Subtask {
    id?: string;
    name: string;
    description?: string;
    status: typeof TASKSSTATUS[number]['value'];
    taskId?: string;
    authorId?: string;
    author?:User;
    creation_date?: string;
    update_date?: string;
    task?:Task;
  }