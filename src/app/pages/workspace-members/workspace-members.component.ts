import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../../service/workspace/workspace.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../model/user.interface';
import { FormsModule } from '@angular/forms';

interface Invitation {
  id: string;
  code: string;
  token: string;
  isActive: boolean;
  maxUses?: number;
  uses: number;
  expiresAt?: string;
  createdAt: string;
  author: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

@Component({
  selector: 'app-workspace-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workspace-members.component.html',
  styleUrl: './workspace-members.component.css'
})
export class WorkspaceMembersComponent implements OnInit {
  private workspaceService = inject(WorkspaceService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  workspaceId: string | null = null;
  creator: User | null = null;
  owners: User[] = [];
  members: User[] = [];
  invitations: Invitation[] = [];
  currentUserId: string | null = null;

  loading = true;
  error: string | null = null;
  showInviteModal = false;

  // Invitation form
  maxUses: number | null = null;
  expiresInDays: number | null = null;
  generatedLink: string | null = null;
  linkCopied = false;

  ngOnInit(): void {
    this.currentUserId = this.authService.getId();
    this.workspaceId = this.route.parent?.snapshot.paramMap.get('workspaceId') || null;
    if (this.workspaceId) {
      this.loadMembers();
      this.loadInvitations();
    }
  }

  private loadMembers(): void {
    if (!this.workspaceId) return;

    this.workspaceService.getWorkspaceMembers(this.workspaceId).subscribe({
      next: (data: { creator: User; owners: User[]; members: User[] }) => {
        this.creator = data.creator;
        this.owners = data.owners || [];
        this.members = data.members || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading members:', err);
        this.error = 'Failed to load workspace members';
        this.loading = false;
      }
    });
  }

  private loadInvitations(): void {
    if (!this.workspaceId) return;

    this.workspaceService.getWorkspaceInvitations(this.workspaceId).subscribe({
      next: (invitations: Invitation[]) => {
        this.invitations = invitations;
      },
      error: (err) => {
        console.warn('Could not load invitations:', err);
      }
    });
  }

  openInviteModal(): void {
    this.showInviteModal = true;
    this.generatedLink = null;
    this.linkCopied = false;
  }

  closeInviteModal(): void {
    this.showInviteModal = false;
    this.maxUses = null;
    this.expiresInDays = null;
    this.generatedLink = null;
    this.linkCopied = false;
  }

  generateInviteLink(): void {
    if (!this.workspaceId) return;

    const invitationData: { maxUses?: number; expiresAt?: string } = {};

    if (this.maxUses && this.maxUses > 0) {
      invitationData.maxUses = this.maxUses;
    }

    if (this.expiresInDays && this.expiresInDays > 0) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + this.expiresInDays);
      invitationData.expiresAt = expiresAt.toISOString();
    }

    this.workspaceService.createInvitation(this.workspaceId, invitationData).subscribe({
      next: (response: { invitation: { token: string } }) => {
        const token = response.invitation.token;
        this.generatedLink = `${window.location.origin}/join-workspace?token=${token}`;
        this.loadInvitations();
      },
      error: (err) => {
        console.error('Error generating invitation:', err);
        alert('Failed to generate invitation link');
      }
    });
  }

  copyInviteLink(): void {
    if (this.generatedLink) {
      navigator.clipboard.writeText(this.generatedLink).then(() => {
        this.linkCopied = true;
        setTimeout(() => {
          this.linkCopied = false;
        }, 3000);
      });
    }
  }

  deactivateInvitation(invitationId: string): void {
    if (confirm('Are you sure you want to deactivate this invitation?')) {
      this.workspaceService.deactivateInvitation(invitationId).subscribe({
        next: () => {
          this.loadInvitations();
        },
        error: (err) => {
          console.error('Error deactivating invitation:', err);
          alert('Failed to deactivate invitation');
        }
      });
    }
  }

  getInvitationStatus(invitation: Invitation): string {
    if (!invitation.isActive) return 'Inactive';
    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) return 'Expired';
    if (invitation.maxUses && invitation.uses >= invitation.maxUses) return 'Max uses reached';
    return 'Active';
  }

  isInvitationActive(invitation: Invitation): boolean {
    return this.getInvitationStatus(invitation) === 'Active';
  }

  getMemberCount(): number {
    return 1 + this.owners.length + this.members.length;
  }

  getActiveInvitationsCount(): number {
    return this.invitations.filter(i => this.isInvitationActive(i)).length;
  }

  isCreator(): boolean {
    console.log('Creator ID:', this.creator?.id);
    console.log('Current User ID:', this.currentUserId);
    console.log('Is Creator:', this.creator?.id === this.currentUserId);
    return this.creator?.id === this.currentUserId;
  }

  removeMember(userId: string, userName: string): void {
    if (!this.workspaceId) return;

    if (confirm(`¿Estás seguro de que deseas eliminar a ${userName} del workspace?`)) {
      console.log('Removing member:', userId, 'from workspace:', this.workspaceId);
      this.workspaceService.removeMemberFromWorkspace(this.workspaceId, userId).subscribe({
        next: (response) => {
          console.log('Member removed successfully:', response);
          this.loadMembers();
        },
        error: (err) => {
          console.error('Error removing member - Full error:', err);
          console.error('Error status:', err.status);
          console.error('Error message:', err.error?.message || err.message);
          alert(`No se pudo eliminar al miembro del workspace: ${err.error?.message || err.message}`);
        }
      });
    }
  }
}
