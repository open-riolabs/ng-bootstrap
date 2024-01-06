import { Type } from '@angular/core';
import { ComponentInfo } from './data/component-info';

export class GenericComponent implements ComponentInfo {
  constructor(public component: Type<any>) {}
  public name!: string;
  public data!: any;
}
