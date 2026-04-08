import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/pages/home/home.component').then(m => m.HomeComponent),
        pathMatch: 'full',
        title: 'Home',
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
        canActivate: [noAuthGuard]
    },
    {
        path: 'join-workspace',
        title: 'Join Workspace',
        loadComponent: () => import('./features/workspaces/pages/join-workspace/join-workspace.component').then(m => m.JoinWorkspaceComponent),
    },
    {
        path: '',
        loadComponent: () => import('./layouts/app-layout/layout.component').then(m => m.LayoutComponent),
        canActivate: [AuthGuard],
        children: [
            {
                path: 'projects',
                title: 'Projects',
                loadComponent: () => import('./features/projects/pages/projects/projects.component').then(m => m.ProjectsComponent),
            },
            {
                path: 'projects/new',
                title: 'New Project',
                loadComponent: () => import('./features/projects/components/project-form/project-form.component').then(m => m.ProjectFormComponent),
            },
            {
                path: 'projects/:projectId/edit',
                title: 'Edit Project',
                loadComponent: () => import('./features/projects/pages/edit-project/edit-project.component').then(m => m.EditProjectComponent),
            },
            {
                path: 'projects/:projectId',
                title: 'Project',
                loadComponent: () => import('./features/projects/pages/dashboard-project/dashboard-project.component').then(m => m.DashboardProjectComponent),
            },
            {
                path: 'tasks',
                title: 'Tasks',
                loadComponent: () => import('./features/tasks/pages/tasks/tasks.component').then(m => m.TasksComponent),
            },
            {
                path: 'tasks/new',
                title: 'New Task',
                loadComponent: () => import('./features/tasks/components/tasks-form/tasks-form.component').then(m => m.TasksFormComponent),
            },
            {
                path: 'tasks/:taskId/edit',
                title: 'Edit Task',
                loadComponent: () => import('./features/tasks/components/tasks-form/tasks-form.component').then(m => m.TasksFormComponent),
            },
            {
                path: 'tasks/:taskId',
                title: 'Task Details',
                loadComponent: () => import('./features/tasks/pages/tasks-details/tasks-details.component').then(m => m.TasksDetailsComponent),
            },
            {
                path: 'comments',
                title: 'Comments',
                loadComponent: () => import('./features/comments/pages/comments/comments.component').then(m => m.CommentsComponent),
            },
            {
                path: 'comments/new',
                title: 'New Comment',
                loadComponent: () => import('./features/comments/components/comments-form/comments-form.component').then(m => m.CommentsFormComponent),
            },
            {
                path: 'comments/:commentId',
                title: 'Comment Details',
                loadComponent: () => import('./features/comments/pages/comments-details/comments-details.component').then(m => m.CommentsDetailsComponent),
            },
            {
                path: 'issues',
                title: 'Issues',
                loadComponent: () => import('./features/issues/pages/issues/issues.component').then(m => m.IssuesComponent),
            },
            {
                path: 'issues/new',
                title: 'New Issue',
                loadComponent: () => import('./features/issues/components/issues-form/issues-form.component').then(m => m.IssuesFormComponent),
            },
            {
                path: 'issues/:issueId',
                title: 'Issue Details',
                loadComponent: () => import('./features/issues/pages/issues-details/issues-details.component').then(m => m.IssuesDetailsComponent),
            },
            {
                path: 'subtasks',
                title: 'Subtasks',
                loadComponent: () => import('./features/subtasks/pages/subtasks/subtasks.component').then(m => m.SubtasksComponent),
            },
            {
                path: 'subtasks/:subtaskId',
                title: 'Subtask Details',
                loadComponent: () => import('./features/subtasks/pages/subtasks-details/subtasks-details.component').then(m => m.SubtasksDetailsComponent),
            },
            {
                path: 'profile',
                title: 'Profile',
                loadComponent: () => import('./features/profile/pages/profiles/profiles.component').then(m => m.ProfilesComponent),
            },
            {
                path: 'workspaces/new',
                title: 'New Workspace',
                loadComponent: () => import('./features/workspaces/components/workspace-form/workspace-form.component').then(m => m.WorkspaceFormComponent),
            },
            {
                path: 'workspaces/:workspaceId',
                title: 'Workspace',
                loadComponent: () => import('./features/workspaces/pages/workspace/workspace.component').then(m => m.WorkspaceComponent),
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'dashboard',
                    },
                    {
                        path: 'dashboard',
                        title: 'Dashboard',
                        loadComponent: () => import('./features/workspaces/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
                    },
                    {
                        path: 'settings',
                        title: 'Settings',
                        loadComponent: () => import('./features/workspaces/pages/settings-workspaces/settings-workspaces.component').then(m => m.SettingsComponent),
                    },
                    {
                        path: 'members',
                        title: 'Members',
                        loadComponent: () => import('./features/workspaces/pages/workspace-members/workspace-members.component').then(m => m.WorkspaceMembersComponent),
                    },
                ],
            },
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent),
    }
];
