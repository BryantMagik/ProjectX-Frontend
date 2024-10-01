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
  standalone: true,
  imports: [LayoutComponent, ReactiveFormsModule, CommonModule, MultiSelectModule, DropdownModule,InputTextModule,ToastModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {

  projectForm!: FormGroup;
  users: User[] = []
  proyectoType: ProyectDropdown[] = []
  proyectoStatus: ProyectDropdown[] = []

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

  ngOnInit(): void {

    this.proyectoType = PROYECTOTYPE
    this.proyectoStatus = PROYECTOSTATUS

    this.userService.getAllUsers().subscribe({
      next: (data: User[] | null) => {
        if (data) {
          this.users = data;
          console.log('Usuarios recuperados:', this.users);
        } else {
          console.warn('No se encontraron usuarios');
          this.users = [];
        }
      },
      error: (err) => {
        console.error('Error al obtener los usuarios:', err);
        this.users = [];
      }
    });

    this.projectForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: [''],
      type: ['', Validators.required],
      status: ['', Validators.required],
      participants: [[]],
    })
    console.log('Formulario:', this.projectForm.value);


  }

  onSubmit(): void {

    if (this.projectForm.valid) {
      this.projectService.postProject(this.projectForm.value)
        .subscribe({
          next: (response) => {
            this.showSuccess()
          },
          error: (err) => {
            console.error('Error al crear el proyecto', err);
          }
        })
    } else {
      console.log('Formulario inválido');
    }
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
}
}
