import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../../../../service/workspace/workspace.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-join-workspace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-workspace.component.html',
  styleUrl: './join-workspace.component.css'
})
export class JoinWorkspaceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workspaceService = inject(WorkspaceService);
  private authService = inject(AuthService);

  token: string | null = null;
  loading = true;
  success = false;
  error: string | null = null;
  workspaceName: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.checkAuthAndJoin();
      } else {
        this.error = 'Invalid invitation link';
        this.loading = false;
      }
    });
  }

  private checkAuthAndJoin(): void {
    // Verificar si el usuario está autenticado
    const isAuthenticated = this.authService.isAuthenticated();

    if (!isAuthenticated) {
      // Guardar la URL actual para volver después del login
      const returnUrl = `/join-workspace?token=${this.token}`;
      this.router.navigate(['/login'], { queryParams: { returnUrl } });
      return;
    }

    this.joinWorkspace();
  }

  private joinWorkspace(): void {
    if (!this.token) return;

    this.workspaceService.joinWorkspaceByToken(this.token).subscribe({
      next: (response: any) => {
        this.success = true;
        this.workspaceName = response.workspace.name;
        this.loading = false;

        // Redirect to workspace after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/workspaces', response.workspace.id, 'dashboard']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error joining workspace:', err);
        this.error = err.error?.message || 'Failed to join workspace';
        this.loading = false;
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
