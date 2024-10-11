import { Component } from '@angular/core';

@Component({
  selector: 'app-accordions',
  templateUrl: './accordions.component.html',
  styleUrls: ['./accordions.component.scss'],
})
export class AccordionsComponent {

  onStatusChenged(event: any, i: number) {
    console.log(event + ' ' + i); 
  }
}
