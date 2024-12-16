import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';  // Importa Subscription para manejar la suscripción

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  workspaceId: string | null = null;
  private routeSub: Subscription | null = null; // Variable para manejar la suscripción

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Nos suscribimos al paramMap para recibir actualizaciones cuando el parámetro cambie
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.workspaceId = params.get('id');
      console.log('Workspace ID actualizado:', this.workspaceId);  // Mostrar el nuevo ID
    });
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción cuando el componente sea destruido
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
