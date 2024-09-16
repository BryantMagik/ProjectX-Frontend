import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../pages/layout/layout.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LayoutComponent, NgIf],
  templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
  mostrar = 0;
  colorear: number = 0;
  
  cambiarColor(valor: number) {
    this.colorear = valor;
  }

  constructor(private LayoutComponent: LayoutComponent) { }

  setMostrar(value: number) {
    this.LayoutComponent.setMostrar(value);
  }

  ejecutarAcciones(valor: number) {
    this.setMostrar(valor);
    this.cambiarColor(valor);
  }

  ngOnInit() {
    this.LayoutComponent.mostrar$.subscribe(valor => {
      this.mostrar = valor;
    });

  }


}