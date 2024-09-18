import { Routes } from '@angular/router';
import { AuthGuard } from './service/guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { ProjectsDetailsComponent } from './subpages/projects-details/projects-details.component';

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
        children: [
            {
                path: 'pages/dashboard',
                title: 'Dashboard',
                component: DashboardComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'projects/:id',
                title: 'Project Details',
                component: ProjectsDetailsComponent
            }
        ]
    },

]








