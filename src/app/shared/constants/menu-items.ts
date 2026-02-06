import { MenuItem } from "../../core/models/menu.interface"

export function createMenuItems(id: string): MenuItem[] {
    return [
        {
            icon: 'dashboard',
            label: 'Dashboard',
            route: `/workspaces/${id ?? 'default'}/dashboard`
        },
        {
            icon: 'assignment',
            label: 'My Tasks',
            route: '/tasks',
        },
        {
            icon: 'people',
            label: 'Members',
            route: `/workspaces/${id ?? 'default'}/members`
        },
        {
            icon: 'workspace',
            label: 'Workspace',
            route: `/workspaces/${id ?? 'default'}/settings`
        },
        {
            icon: 'folder',
            label: 'Projects',
            route: '/projects',
        },
        {
            icon: 'bug_report',
            label: 'Issues',
            route: '/issues',
        },
    ]
}



export const MENU_PROFILE: MenuItem[] = [
    {
        label: 'Profile',
        icon: 'pi pi-user',
        route: '/profile'
    },
    // {
    //     label: 'Inbox',
    //     icon: 'pi-inbox',
    //     route: ''
    // },
    {
        label: 'Settings',
        icon: 'pi-cog',
        route: ''
    },
    {
        label: 'Sign Out',
        icon: 'pi-power-off',
        route: ''
    }
]

export const TASK_OPTIONS: MenuItem[] = [
    {
        label: 'Task Details',
        icon: 'pi-external-link',
        route: '/tasks'
    },
    {
        label: 'Open Project',
        icon: 'pi-external-link',
        route: '/projects'
    },
    {
        label: 'Edit Task',
        icon: 'pi-pen-to-square',
        route: ''
    },
    {
        label: 'Delete Task',
        icon: 'pi-trash',
        route: ''
    },
]
