import { User } from "./user.interface";

export enum IssueType {
    BUG = 'BUG',
    FEATURE_REQUEST = 'FEATURE_REQUEST'
  }
  
  export enum IssueStatus {
    PENDING = 'PENDING',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED'
  }
  
  export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
  }

  export interface Assigneds {
    name: any;
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  }
  
  export interface Issue {
    id?: string;
    code: string;
    type: IssueType;
    summary: string;
    description?: string;
    priority: TaskPriority;
    projectId: string;
    reporter?: User;
    reporterId?: string;
    status: IssueStatus;
    createdAt?: Date;
    updatedAt?: Date;
    assignedTo?:Assigneds[];
  }
  