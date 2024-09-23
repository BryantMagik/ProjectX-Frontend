import { Component, OnInit,ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { TicketComponent } from '../../shared/ticket/ticket.component';
import { ProfilesComponent } from '../profiles/profiles.component';
import { NgIf } from '@angular/common';
import { CustomSidebarComponent } from '../../shared/custom-sidebar/custom-sidebar.component';
import { CommentsDetailsComponent } from "../../subpages/comments-details/comments-details.component";
import { ProjectsDetailsComponent } from "../../subpages/projects-details/projects-details.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, TicketComponent, ProfilesComponent, NgIf, CustomSidebarComponent, CommentsDetailsComponent, ProjectsDetailsComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {

  // private formuSubject = new BehaviorSubject<number>(0);
  // formu$ = this.formuSubject.asObservable();
  // formu!: number;

  // private mostrarSubject = new BehaviorSubject<number>(0);
  // mostrar$ = this.mostrarSubject.asObservable();
  // mostrar!: number;

  // private mirandoSubject = new BehaviorSubject<number>(0);
  // mirando$ = this.mirandoSubject.asObservable();
  // mirando!: number;

  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;

  constructor() {}

  ngOnInit() {
  //   this.formu$.subscribe(value =>{
  //     this.formu = value;
  //   }
  //   );
  //   this.mostrar$.subscribe(value => {
  //     this.mostrar = value;
  //   });

  //   this.mirando$.subscribe(value => {
  //     this.mirando = value;
  //   });
  // }
  // setFormular(value: number){
  //   this.formuSubject.next(value);
  // }

  // setMostrar(value: number) {
  //   this.mostrarSubject.next(value);
  // }

  // setMirando(value: number) {
  //   this.mirandoSubject.next(value);
  }
  
  // getMostrar(): number {
  //   // return this.mostrar;
  // }
}