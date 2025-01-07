import { MenuItem } from "../model/menu.interface"

export function createMenuItems(id: string): MenuItem[] {
    return [
        {
            icon: 'dashboard',
            label: 'Dashboard',
            route: 'pages/dashboard',
        },
        {
            icon: 'assignment',
            label: 'My Tasks',
            route: 'pages/tasks',
        },
        {
            icon: 'settings',
            label: 'Setting',
            route: `pages/settings/${id ?? 'default'}`
        },
        {
            icon: 'subdirectory_arrow_right',
            label: 'SubTasks',
            route: 'pages/subtasks',
        },
        {
            icon: 'bug_report',
            label: 'Issues',
            route: 'pages/issues',
        },
    ]
}



export const MENU_PROFILE: MenuItem[] = [
    {
        label: 'Profile',
        icon: 'pi pi-user',
        route: 'pages/profile'
    },
    {
        label: 'Inbox',
        icon: 'pi-inbox',
        route: ''
    },
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
