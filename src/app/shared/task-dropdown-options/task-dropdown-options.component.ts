import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { TASK_OPTIONS } from '../../constants/menu-items';
import { MenuItem } from '../../model/menu.interface';

@Component({
  selector: 'app-task-dropdown-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-dropdown-options.component.html',
  styleUrl: './task-dropdown-options.component.css'
})
export class TaskDropdownOptionsComponent {
  dropdownVisible = false
  selectedOption: string = ''

  menuItems = signal<MenuItem[]>(TASK_OPTIONS)

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  closeDropdown() {
    this.dropdownVisible = false;
  }

  selectOption(option: string): void {
    if(option === ''){

    }
  }
  
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = event.target instanceof HTMLElement && event.target.closest('.dropdown-container');
    if (!clickedInside) {
      this.closeDropdown();
    }
  }
}
