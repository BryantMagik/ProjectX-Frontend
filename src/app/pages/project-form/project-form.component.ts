import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LayoutComponent } from '../../pages/layout/layout.component';
import { ProjectService } from '../../service/project/project.service';
import { Router } from '@angular/router';
import { User } from '../../model/user.interface';
import { UserService } from '../../service/user/user.service';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProyectDropdown, PROYECTOSTATUS, PROYECTOTYPE } from '../../types/models';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule, CommonModule, MultiSelectModule, DropdownModule, InputTextModule, ToastModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
  standalone: true

})
export class ProjectFormComponent implements OnInit {

  projectForm!: FormGroup;
  users: User[] = []
  proyectoType: ProyectDropdown[] = []
  proyectoStatus: ProyectDropdown[] = []
  authorId: string | null = null

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  navigateToProjects() {
    this.router.navigate(['/pages/projects'])
  }

  ngOnInit(): void {}

  onSubmit(): void {
  }
}
