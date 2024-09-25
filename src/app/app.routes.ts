import { Routes } from '@angular/router';
import { AuthGuard } from './service/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { ProjectsDetailsComponent } from './subpages/projects-details/projects-details.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { SubtasksComponent } from './pages/subtasks/subtasks.component';
import { IssuesComponent } from './pages/issues/issues.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { ProfilesComponent } from './pages/profiles/profiles.component';
import { ProjectFormComponent} from './shared/project-form/project-form.component';
import { TasksFormComponent } from './shared/tasks-form/tasks-form.component';
import { SubtasksFormComponent } from './shared/subtasks-form/subtasks-form.component';
import { IssuesFormComponent } from './shared/issues-form/issues-form.component';
import { CommentsFormComponent } from './shared/comments-form/comments-form.component';

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
                path: 'pages/dashboard',
                title: 'Dashboard',
                component: DashboardComponent,
            },
            {
                path: 'pages/profile',
                title: 'Profile',
                component: ProfilesComponent,
            },
            {
                path: 'pages/tasks',
                title: 'Task',
                component: TasksComponent,
            },
            {
                path: 'pages/subtasks',
                title: 'SubTasks',
                component: SubtasksComponent
            },
            {
                path: 'pages/issues',
                title: 'Issues',
                component: IssuesComponent
            },
            {
                path: 'pages/comments',
                title: 'Comments',
                component: CommentsComponent
            },
            {
                path: 'pages/projects',
                title: 'Projects',
                component: ProjectsComponent,
            },
            {
                path: 'pages/projects/:id',
                title: 'Project Details',
                component: ProjectsDetailsComponent
            },
            {
                path: 'pages/projects/shared/project-form',
                title: 'Project Form',
                component: ProjectFormComponent
            },
            {
                path: 'pages/tasks/shared/tasks-form',
                title: 'Task Form',
                component: TasksFormComponent
            },
            {
                path: 'pages/subtasks/shared/subtasks-form',
                title: 'Subtasks Form',
                component: SubtasksFormComponent
            },
            {
                path: 'pages/issues/shared/issues-form',
                title: 'Issues Form',
                component: IssuesFormComponent
            },
            {
                path: 'pages/comments/shared/comments-form',
                title: 'Comments Form',
                component: CommentsFormComponent
            }
        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
