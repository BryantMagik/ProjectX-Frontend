import { Routes } from '@angular/router';
import { AuthGuard } from './service/guards/auth.guard';
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
import { MyTaskComponent } from './pages/my-task/my-task.component';

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
                path: 'pages/subtasks',
                title: 'projects',
                component: ProjectsComponent
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
                        path: 'tasks',
                        title: 'Task',
                        component: MyTaskComponent
                    },
                    {
                        path: ':projectId',
                        title: 'Project',
                        component: DashboardProjectComponent
                    },
                ]
            },
            {
                path: 'pages/issues',
                title: 'Issues',
                component: IssuesComponent,
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
