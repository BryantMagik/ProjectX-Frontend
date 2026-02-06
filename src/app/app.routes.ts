import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/pages/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { DashboardComponent } from './features/workspaces/pages/dashboard/dashboard.component';
import { LayoutComponent } from './layouts/app-layout/layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectsComponent } from './features/projects/pages/projects/projects.component';
import { ProfilesComponent } from './features/profile/pages/profiles/profiles.component';
import { WorkspaceFormComponent } from './features/workspaces/components/workspace-form/workspace-form.component';
import { ProjectFormComponent } from './features/projects/components/project-form/project-form.component';
import { SettingsComponent } from './features/workspaces/pages/settings-workspaces/settings-workspaces.component';
import { WorkspaceComponent } from './features/workspaces/pages/workspace/workspace.component';
import { DashboardProjectComponent } from './features/projects/pages/dashboard-project/dashboard-project.component';
import { EditProjectComponent } from './features/projects/pages/edit-project/edit-project.component';
import { TasksFormComponent } from './features/tasks/components/tasks-form/tasks-form.component';
import { TasksComponent } from './features/tasks/pages/tasks/tasks.component';
import { TasksDetailsComponent } from './features/tasks/pages/tasks-details/tasks-details.component';
import { WorkspaceMembersComponent } from './features/workspaces/pages/workspace-members/workspace-members.component';
import { JoinWorkspaceComponent } from './features/workspaces/pages/join-workspace/join-workspace.component';
import { CommentsComponent } from './features/comments/pages/comments/comments.component';
import { CommentsDetailsComponent } from './features/comments/pages/comments-details/comments-details.component';
import { CommentsFormComponent } from './features/comments/components/comments-form/comments-form.component';
import { IssuesComponent } from './features/issues/pages/issues/issues.component';
import { IssuesDetailsComponent } from './features/issues/pages/issues-details/issues-details.component';
import { IssuesFormComponent } from './features/issues/components/issues-form/issues-form.component';
import { SubtasksComponent } from './features/subtasks/pages/subtasks/subtasks.component';
import { SubtasksDetailsComponent } from './features/subtasks/pages/subtasks-details/subtasks-details.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
        title: 'Home',
    },
    {
        path: 'login',
        title: 'Login',
        component: LoginComponent,
    },
    {
        path: 'join-workspace',
        title: 'Join Workspace',
        component: JoinWorkspaceComponent,
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'projects',
                title: 'Projects',
                component: ProjectsComponent,
            },
            {
                path: 'projects/new',
                title: 'New Project',
                component: ProjectFormComponent,
            },
            {
                path: 'projects/:projectId/edit',
                title: 'Edit Project',
                component: EditProjectComponent,
            },
            {
                path: 'projects/:projectId',
                title: 'Project',
                component: DashboardProjectComponent,
            },
            {
                path: 'tasks',
                title: 'Tasks',
                component: TasksComponent,
            },
            {
                path: 'tasks/new',
                title: 'New Task',
                component: TasksFormComponent,
            },
            {
                path: 'tasks/:taskId/edit',
                title: 'Edit Task',
                component: TasksFormComponent,
            },
            {
                path: 'tasks/:taskId',
                title: 'Task Details',
                component: TasksDetailsComponent,
            },
            {
                path: 'comments',
                title: 'Comments',
                component: CommentsComponent,
            },
            {
                path: 'comments/new',
                title: 'New Comment',
                component: CommentsFormComponent,
            },
            {
                path: 'comments/:commentId',
                title: 'Comment Details',
                component: CommentsDetailsComponent,
            },
            {
                path: 'issues',
                title: 'Issues',
                component: IssuesComponent,
            },
            {
                path: 'issues/new',
                title: 'New Issue',
                component: IssuesFormComponent,
            },
            {
                path: 'issues/:issueId',
                title: 'Issue Details',
                component: IssuesDetailsComponent,
            },
            {
                path: 'subtasks',
                title: 'Subtasks',
                component: SubtasksComponent,
            },
            {
                path: 'subtasks/:subtaskId',
                title: 'Subtask Details',
                component: SubtasksDetailsComponent,
            },
            {
                path: 'profile',
                title: 'Profile',
                component: ProfilesComponent,
            },
            {
                path: 'workspaces/new',
                title: 'New Workspace',
                component: WorkspaceFormComponent,
            },
            {
                path: 'workspaces/:workspaceId',
                title: 'Workspace',
                component: WorkspaceComponent,
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'dashboard',
                    },
                    {
                        path: 'dashboard',
                        title: 'Dashboard',
                        component: DashboardComponent,
                    },
                    {
                        path: 'settings',
                        title: 'Settings',
                        component: SettingsComponent,
                    },
                    {
                        path: 'members',
                        title: 'Members',
                        component: WorkspaceMembersComponent,
                    },
                ],
            },
        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
