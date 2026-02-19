import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CustomSidebarComponent } from './components/custom-sidebar/custom-sidebar.component';
import { UserService } from '../../features/profile/data-access/user.service';
import { User } from '../../core/models/user.interface';
import { tap } from 'rxjs';


@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, NavbarComponent, CustomSidebarComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
    standalone:true
})
export class LayoutComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);


  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;

  loading = true;
  error: string | null = null;
  user: User | null = null;
  showModal = false;
  workspaceId: string | null = null

  constructor() { }

  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  onWorkspaceSelected(workspaceId: string) {
    this.workspaceId = workspaceId
  }

  ngOnInit() {
    this.loadUserProfile()
    this.route.paramMap.subscribe((params) => {
      this.workspaceId = params.get('workspaceId')
    })
  }

  private loadUserProfile(): void {
    this.userService.loadUserProfile().pipe(
      tap({
        next: (user: User | null) => {
          this.user = user;
          if (!user) {
            this.error = 'Failed to load user profile';
          }
        },
        error: () => this.error = 'Failed to load user profile',
        complete: () => this.loading = false,
      })
    ).subscribe();
  }




}
