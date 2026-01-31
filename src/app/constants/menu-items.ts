import { MenuItem } from "../model/menu.interface"

export function createMenuItems(id: string): MenuItem[] {
    return [
        {
            icon: 'dashboard',
            label: 'Dashboard',
            route: `/pages/${id ?? 'default'}/dashboard`
        },
        {
            icon: 'assignment',
            label: 'My Tasks',
            route: '/pages/tasks',
        },
        {
            icon: 'people',
            label: 'Members',
            route: `/pages/${id ?? 'default'}/members`
        },
        {
            icon: 'workspace',
            label: 'Workspace',
            route: `/pages/${id ?? 'default'}/workspace`
        },
        {
            icon: 'folder',
            label: 'Projects',
            route: '/pages/projects',
        },
        {
            icon: 'bug_report',
            label: 'Issues',
            route: '/pages/issues',
        },
    ]
}



export const MENU_PROFILE: MenuItem[] = [
    {
        label: 'Profile',
        icon: 'pi pi-user',
        route: 'pages/profile'
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
        route: 'pages/profile'
    },
    {
        label: 'Open Project',
        icon: 'pi-external-link',
        route: 'pages/profile'
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
