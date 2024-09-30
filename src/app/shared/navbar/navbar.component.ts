import { Component, OnInit,signal,computed } from '@angular/core';
import { LayoutComponent } from '../../pages/layout/layout.component';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { User } from '../../model/user.interface';
import { UserService } from '../../service/user/user.service';
import { filter, map, tap } from 'rxjs';
import { NotificationsComponent } from '../notifications/notifications.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterLink, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';

interface BreadCrumbRoute extends Route {
  data?: {
    breadcrumb?: string
  }
}


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LayoutComponent, NgIf, NotificationsComponent, CommonModule, NgClass, RouterLink, RouterModule, BreadcrumbModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isNotificationOpen = false;

  isUsernameDropdownOpen = false;

  isDropdownOpen: boolean = false;
  user: User | null = null;
  loading = true;
  error: string | null = null;

  mostrar: number = 0;
  colorear: number = 0;
  textos: string[] = ['Home', 'Profiles', 'Projects', 'Tasks', 'Subtasks', 'Issues', 'Comments'];

  mirando: number = 0;
  textos2: string[] = [' ', 'Projects-Details', 'Tasks-Details', 'Subtasks-Details', 'Issues-Details', 'Comments-Details'];

  // items: any[] = []

  //items: MenuItem[] | undefined

  home: MenuItem | undefined
  breadcrumbs: Array<{ label: string; url: string }> = [];


  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }


   toggleNotificationDropdown() {
     this.isNotificationOpen = !this.isNotificationOpen;
   }

   navigateToProfile() {
    this.router.navigate(['/pages/profile']);
   }

   toggleUsernameDropdown() {
     this.isUsernameDropdownOpen = !this.isUsernameDropdownOpen;
   }

  // toggleDropdown(): void {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }

  // setMostrar(value: number) {
  //   this.LayoutComponent.setMostrar(value);
  // }

  // setMirando(value: number) {
  //   this.LayoutComponent.setMirando(value);
  // }

  ngOnInit():void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.buildBreadcrumbs(this.route.root))
      )
      .subscribe((breadcrumbs) => {
        this.breadcrumbs = breadcrumbs;
      });
    // this.loadUserProfile();






    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   map(() => this.buildBreadcrumbs(this.activatedRoute.root))
    // ).subscribe((breadcrumbs: any[]) => {
    //   this.items = breadcrumbs;
    // });
    // this.LayoutComponent.mostrar$.subscribe(valor => {
    //   this.mostrar = valor;
    // });


    // this.LayoutComponent.mirando$.subscribe(valor => {
    //   this.mirando = valor;
    // });

  }
 

  // private loadUserProfile(): void {
  //   this.userService.loadUserProfile().pipe(
  //     tap({
  //       next: (user: User | null) => {
  //         this.user = user;
  //         if (!user) {
  //           this.error = 'Failed to load user profile';
  //         }
  //       },
  //       error: () => this.error = 'Failed to load user profile',
  //       complete: () => this.loading = false,
  //     })
  //   ).subscribe();
  // }

  // private buildBreadcrumbs(route: ActivatedRoute, breadcrumbs: any[] = []): any[] {
  //   const children: ActivatedRoute[] = route.children; // Obtener hijos de la ruta actual

  //   if (children.length === 0) {
  //     return breadcrumbs;
  //   }

  //   for (const child of children) {
  //     const routeTitle = child.snapshot.data['title']; // Obtener el título de la ruta
  //     const routeURL = child.snapshot.url.map(segment => segment.path).join('/'); // Obtener el segmento de la URL

  //     if (routeTitle) {
  //       breadcrumbs.push({
  //         label: routeTitle, // Usar el título como etiqueta del breadcrumb
  //         routerLink: '/' + routeURL // Construir la URL sin parámetros dinámicos
  //       });
  //     }

  //     return this.buildBreadcrumbs(child, breadcrumbs); // Recursivamente construir los breadcrumbs para rutas anidadas
  //   }

  //   return breadcrumbs;
  // }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{ label: string; url: string }> = []): Array<{ label: string; url: string }> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const breadcrumbLabel = child.snapshot.data['breadcrumb'];
      if (breadcrumbLabel) {
        breadcrumbs.push({ label: breadcrumbLabel, url });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }



}