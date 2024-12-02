import { MenuItem } from "../model/menu.interface"

export const MENU_ITEMS: MenuItem[] = [
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
        icon: 'subdirectory_arrow_right',
        label: 'SubTasks',
        route: 'pages/subtasks',
    },
    {
        icon: 'bug_report',
        label: 'Issues',
        route: 'pages/issues',
    },
    {
        icon: 'comment',
        label: 'Comments',
        route: 'pages/comments',
    },
]

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
