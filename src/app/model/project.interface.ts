import { User } from "./user.interface"

export interface Project {
    id: string
    code: string
    name: string
    description: string
    status: string
    type: string
    userId: string
    author: User
    createdAt: string
    updatedAt: string
}