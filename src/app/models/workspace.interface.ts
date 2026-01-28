import { User } from "./user.interface"

export interface Workspace {
    id: string
    name: string
    image: string
    description: string
    members: User[]
}