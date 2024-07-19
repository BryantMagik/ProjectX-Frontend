import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './service/guards/authenticated.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component'),
        canActivate: [AuthenticatedGuard]
    },

];

