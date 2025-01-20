import { Routes } from '@angular/router';
import { AuthGuard } from './service/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { SubtasksComponent } from './pages/subtasks/subtasks.component';
import { IssuesComponent } from './pages/issues/issues.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { ProfilesComponent } from './pages/profiles/profiles.component';
import { ProjectFormComponent } from './shared/project-form/project-form.component';
import { TasksFormComponent } from './shared/tasks-form/tasks-form.component';
import { SubtasksFormComponent } from './shared/subtasks-form/subtasks-form.component';
import { IssuesFormComponent } from './shared/issues-form/issues-form.component';
import { CommentsFormComponent } from './shared/comments-form/comments-form.component';
import { WorkspaceFormComponent } from './shared/workspace-form/workspace-form.component';
import { CommentsDetailsComponent } from './subpages/comments-details/comments-details.component';
import { SubtasksDetailsComponent } from './subpages/subtasks-details/subtasks-details.component';
import { IssuesdetailsComponent } from './subpages/issuesdetails/issuesdetails.component';
import { SettingsComponent } from './pages/settings-workspaces/settings-workspaces.component';
import { WorkspaceComponent } from './pages/workspace/workspace.component';
import { DashboardProjectComponent } from './pages/dashboard-project/dashboard-project.component';

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
                        path: ':projectId',
                        title: 'Project',
                        component: DashboardProjectComponent
                    }
                ]
            },
            {
                path: 'pages/issues',
                title: 'Issues',
                component: IssuesComponent,
                data: { breadcrumb: 'Issues' }
            },
            {
                path: 'pages/shared/workspace-form',
                title: 'Workspace Form',
                component: WorkspaceFormComponent,
                data: { breadcrumb: 'Workspace Form' }
            },
        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
