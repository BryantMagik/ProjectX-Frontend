import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-severity-tag',
    template: `
    <p-tag [value]="value" [severity]="getSeverity()"></p-tag>
  `,
    standalone: true,
    imports: [TagModule],
    styles: []
})
export class SeverityTagComponent {
    @Input() value!: string;
    @Input() type!: 'status' | 'priority' | 'type';

    getSeverity(): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
        if (this.type === 'status') {
            switch (this.value) {
                case 'ONGOING':
                    return 'warning';
                case 'ONWAIT':
                    return 'danger';
                case 'COMPLETED':
                    return 'success';
                case 'PENDING':
                    return 'contrast';
                default:
                    return undefined;
            }
        } else if (this.type === 'priority') {
            switch (this.value) {
                case 'HIGH':
                    return 'danger';
                case 'MEDIUM':
                    return 'warning';
                case 'LOW':
                    return 'success';
                default:
                    return undefined;
            }
        } else if(this.type === 'type') {
            switch (this.value) {
                case 'SOFTWARE':
                  return 'success';
                case 'EXTERNAL':
                  return 'warning';
                case 'RESEARCH':
                  return 'danger';
                case 'INTERNAL':
                  return 'info';
                default:
                  return undefined;
              }
        }
        return undefined;
    }
}
