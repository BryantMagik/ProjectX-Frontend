import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketComponent } from '../ticket/ticket.component';
import { CommentsComponent } from '../../pages/comments/comments.component';
import { IssuesComponent } from '../../pages/issues/issues.component';
import { ProjectsComponent } from '../../pages/projects/projects.component';
import { SubtasksComponent } from '../../pages/subtasks/subtasks.component';
import { ProfilesComponent } from '../../pages/profiles/profiles.component';
import { IssuesdetailsComponent } from '../../subpages/issuesdetails/issuesdetails.component';
import { ProjectsDetailsComponent } from '../../subpages/projects-details/projects-details.component';
import { CommentsDetailsComponent } from '../../subpages/comments-details/comments-details.component';
import { TasksDetailsComponent } from '../../subpages/tasks-details/tasks-details.component';
import { SubtasksDetailsComponent } from '../../subpages/subtasks-details/subtasks-details.component';
import { TasksBoardComponent } from "../tasks-board/tasks-board.component";
import { SubtasksBoardComponent } from "../subtasks-board/subtasks-board.component";
import { IssuesBoardComponent } from "../issues-board/issues-board.component";
import { CommentsBoardComponent } from "../comments-board/comments-board.component";
import { TasksComponent } from '../../pages/tasks/tasks.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TicketComponent,TasksBoardComponent, CommentsComponent, IssuesComponent, ProjectsComponent, SubtasksComponent, TasksComponent, ProfilesComponent, IssuesdetailsComponent, ProjectsDetailsComponent, CommentsDetailsComponent, TasksDetailsComponent, SubtasksDetailsComponent,  SubtasksBoardComponent, IssuesBoardComponent, CommentsBoardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

}
