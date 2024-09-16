import { Component,OnInit } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';

interface Issue {
  id: string;
  tipo: string;
  resumen: string;
  descripcion: string;
  asignado: string;
  reportadoPor: string;
  estado: string;
}

@Component({
  selector: 'app-issuesdetails',
  standalone: true,
  imports: [NgFor,CommonModule,NgClass],
  templateUrl: './issuesdetails.component.html',
  styleUrl: './issuesdetails.component.css'
})
export class IssuesdetailsComponent implements OnInit{
  issues: Issue[] = [
    {
      id: 'ISSUE-001',
      tipo: 'Bug',
      resumen: 'Error en la página de login',
      descripcion: 'Hay un error que impide que los usuarios puedan iniciar sesión en la página de login. El error ocurre cuando se ingresan credenciales incorrectas.',
      asignado: 'Juan Pérez',
      reportadoPor: 'María García',
      estado: 'Abierto'
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
