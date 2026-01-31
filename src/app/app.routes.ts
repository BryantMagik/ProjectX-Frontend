import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { IssuesComponent } from './pages/issues/issues.component';
import { ProfilesComponent } from './pages/profiles/profiles.component';
import { WorkspaceFormComponent } from './shared/workspace-form/workspace-form.component';
import { SettingsComponent } from './pages/settings-workspaces/settings-workspaces.component';
import { WorkspaceComponent } from './pages/workspace/workspace.component';
import { DashboardProjectComponent } from './pages/dashboard-project/dashboard-project.component';
import { EditProjectComponent } from './subpages/edit-project/edit-project.component';
import { TasksFormComponent } from './shared/tasks-form/tasks-form.component';
import { TasksDetailsComponent } from './subpages/tasks-details/tasks-details.component';
import { SubtasksFormComponent } from './shared/subtasks-form/subtasks-form.component';
import { SubtasksDetailsComponent } from './subpages/subtasks-details/subtasks-details.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { WorkspaceMembersComponent } from './pages/workspace-members/workspace-members.component';
import { JoinWorkspaceComponent } from './pages/join-workspace/join-workspace.component';

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
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
              path: 'pages/tasks',
              title: 'Tasks',
              component: TasksComponent,
            },
            {
                path: 'pages/profile',
                title: 'Profile',
                component: ProfilesComponent,
            },
            {
                path: 'pages/shared/workspace-form',
                title: 'Workspace Form',
                component: WorkspaceFormComponent,
            },
            {
                path: 'pages/issues',
                title: 'Issues',
                component: IssuesComponent,
            },
            {
                path: 'pages/join-workspace',
                title: 'Join Workspace',
                component: JoinWorkspaceComponent,
            },
            {
              path: 'pages/tasks/shared/tasks-form',
              title: 'New Task',
              component: TasksFormComponent,
            },
            {
              path: 'pages/tasks/shared/tasks-form/:id',
              title: 'Edit Task',
              component: TasksFormComponent,
            },
            {
              path: 'pages/tasks/subpages/tasks-details/:id',
              title: 'Task Details',
              component: TasksDetailsComponent,
            },
            {
                path: 'pages/subtasks',
                title: 'projects',
                component: ProjectsComponent
            },
            {
              path: 'pages/subtasks/shared/subtasks-form',
              title: 'New Subtask',
              component: SubtasksFormComponent,
            },
            {
              path: 'pages/subtasks/shared/subtasks-form/:id',
              title: 'Edit Subtask',
              component: SubtasksFormComponent,
            },
            {
              path: 'pages/subtasks/subpages/subtasks-details/:id',
              title: 'Subtask Details',
              component: SubtasksDetailsComponent,
            },
            {
                path: 'pages/:workspaceId',
                title: 'Workspace',
                component: WorkspaceComponent,
                children: [
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
                    {
                        path: ':projectId',
                        title: 'Project',
                        component: DashboardProjectComponent
                    }
                ]
            },
            {
                path: 'pages/projects/subpages/edit-project/:projectId',
                title: 'Edit Project',
                component: EditProjectComponent,

            },
        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
