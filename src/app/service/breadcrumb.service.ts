import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Breadcrumb } from '../model/breadcrumb.interface';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);


  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.createBreadcrumbs(this.activatedRoute.root))
    ).subscribe(breadcrumbs => this.breadcrumbsSubject.next(breadcrumbs));
  }

  getBreadcrumbs(): Observable<Breadcrumb[]> {
    return this.breadcrumbsSubject.asObservable();
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        const nextUrl = `${url}/${routeURL}`;
        breadcrumbs.push({ label: routeURL, url: nextUrl });
      }
      this.createBreadcrumbs(child, `${url}/${routeURL}`, breadcrumbs);
    }
    return breadcrumbs;
  }
}
