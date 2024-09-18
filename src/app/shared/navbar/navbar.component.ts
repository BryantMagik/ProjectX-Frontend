import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../pages/layout/layout.component';
import { NgIf } from '@angular/common';
import { User } from '../../model/user.interface';
import { UserService } from '../../service/user/user.service';
import { tap } from 'rxjs';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LayoutComponent, NgIf, NotificationsComponent],
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

  constructor(private LayoutComponent: LayoutComponent, private userService: UserService) { }

  toggleNotificationDropdown(){
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  toggleUsernameDropdown() {
    this.isUsernameDropdownOpen = !this.isUsernameDropdownOpen;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setMostrar(value: number) {
    this.LayoutComponent.setMostrar(value);
  }

  setMirando(value: number) {
    this.LayoutComponent.setMirando(value);
  }

  ngOnInit() {
    this.loadUserProfile()
    this.LayoutComponent.mostrar$.subscribe(valor => {
      this.mostrar = valor;
    });


    this.LayoutComponent.mirando$.subscribe(valor => {
      this.mirando = valor;
    });

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