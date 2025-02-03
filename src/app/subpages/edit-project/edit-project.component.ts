import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder,FormGroup,Validators,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ProjectService } from '../../service/project/project.service';
import { Project } from '../../model/project.interface';
import { Location, NgFor, NgIf } from '@angular/common';
import { PROYECTOTYPE, PROYECTOSTATUS } from '../../types/models';
import { from } from 'rxjs';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit {

  @Input() workspace: string | null = null

  projectForm: FormGroup;
  projectId: string | null = null;
  projectImage: string | ArrayBuffer | null = '';

  projectTypes = PROYECTOTYPE;
  projectStatuses = PROYECTOSTATUS;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      status: ['', Validators.required],
      type: ['', Validators.required],
      participants: ['',Validators.required],
      image: ['']
    });
  }

  onCancel(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    if (this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe((project) => {
        if (project) {
          this.projectForm.patchValue({
            name: project.name,
            description: project.description,
            status: project.status,
            type: project.type,
            participants: project.participants,
            image: project.image || ''
          });
          this.projectImage = project.image || '';
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.projectImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.projectService.updateProject(this.projectForm.value, this.projectId || '').subscribe(() => {
        console.log('Project updated successfully');
        this.router.navigate(['/projects']);
      });
    }
  }


}
