import { Project } from "./project.interface"
import { User } from "./user.interface"

export interface Task {
    id: string
    name: string
    description: string
    dueTime: string
    priority: string
    task_type: string
    status: string
    projectId: string
    project: Project
    creator: User
    code: string
    summary: string
    creators: User[]
    users: User[]
    createdAt: string
    updatedAt: string
}

