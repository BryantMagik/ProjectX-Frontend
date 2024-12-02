import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../model/user.interface';

@Component({
  selector: 'app-workspace-form',
  standalone: true,
  imports: [],
  templateUrl: './workspace-form.component.html',
  styleUrl: './workspace-form.component.css'
})
export class WorkspaceFormComponent implements OnInit {

  workspaceForm!: FormGroup
  users: User[] = []
  authorId: string | null = null

  constructor(
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.authorId = sessionStorage.getItem('userId');
  }
}
