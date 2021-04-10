import { Pipe, PipeTransform } from '@angular/core';
import { capitalize, startCase } from 'lodash-es';

@Pipe({
  name: 'toStartCase',
})
export class ToStartCasePipe implements PipeTransform {
  transform(str: string, args?: any): any {
    return capitalize(startCase(str));
  }
}
