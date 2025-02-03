import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CustomSidebarComponent } from '../../shared/custom-sidebar/custom-sidebar.component';
import { UserService } from '../../service/user/user.service';
import { User } from '../../model/user.interface';
import { tap } from 'rxjs';
import { ModalCreateProjectComponent } from "../../shared/modal-create-project/modal-create-project.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, NavbarComponent, CustomSidebarComponent, ModalCreateProjectComponent, CommonModule],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
    standalone:true
})
export class LayoutComponent implements OnInit {

  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;

  loading = true;
  error: string | null = null;
  user: User | null = null;
  showModal = false;
  workspaceId: string | null = null

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

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
      console.log('Workspace ID Layout:', this.workspaceId)
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