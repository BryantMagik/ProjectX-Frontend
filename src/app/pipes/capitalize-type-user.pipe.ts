import { Pipe, PipeTransform } from '@angular/core';
import { userTypeMap } from '../constants/user-type-items';

@Pipe({
  name: 'capitalizeTypeUser'
})
export class CapitalizeTypeUserPipe implements PipeTransform {
  transform(value: 'TRAINEE' | 'DEVELOPER' | 'MANAGER' | 'DESIGNER' | 'QA' | 'PRODUCT_OWNER' | null | undefined): string {
    if (!value) return 'Unknown'
    return userTypeMap[value] || 'Unknown'
  }
}
