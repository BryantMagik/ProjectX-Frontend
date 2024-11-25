import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CustomSidebarComponent } from '../../shared/custom-sidebar/custom-sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CustomSidebarComponent,],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  @ViewChild(NavbarComponent) navbarComponent!: NavbarComponent;

  constructor() { }

  ngOnInit() {

  }
}