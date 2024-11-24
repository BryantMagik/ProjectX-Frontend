import { MenuItem } from "../../model/menu.interface";
export const MENU_ITEMS: MenuItem[] = [
    {
        icon: 'dashboard',
        label: 'Dashboard',
        route: 'pages/dashboard',
    },
    {
        icon: 'folder_open',
        label: 'Projects',
        route: 'pages/projects',
    },
    {
        icon: 'assignment',
        label: 'Task',
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
