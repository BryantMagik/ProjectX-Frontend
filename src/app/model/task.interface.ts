import { Project } from "./project.interface"
import { User } from "./user.interface"

export interface Author {
    id: string
    name: string 
  }
export interface Task {
    id: string
    code: string
    name: string
    description: string
    priority: string
    task_type: string
    status: string
    projectId: string
    project: Project
    creator: User
    creators: User[]
    users: User[]
    createdAt: string
    updatedAt: string
}

