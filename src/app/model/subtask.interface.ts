import { TASKSSTATUS } from "../types/models";

export interface Subtask {
    id: string;
    name: string;
    description?: string;
    status: typeof TASKSSTATUS[number]['value'];
    taskId: string;
    authorId: string;
    creation_date?: string;
    update_date?: string;
  }