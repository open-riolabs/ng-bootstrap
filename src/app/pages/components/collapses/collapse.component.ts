import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './collapse.component.html',
    standalone: false
})
export class CollapesesComponent {

  message: number = 0;

  onStatusChange(event: any, i: number){
    this.message++;
  }

sample: string = `<button rlb-button toggle="collapse" toggle-target="collapse-id">Collapse</button>
<rlb-collapse id="collapse-id">
  <span>Collapse Content</span>
</rlb-collapse>`;

orientation: string = `<button rlb-button toggle="collapse" toggle-target="collapse-id2">Collapse</button>
<rlb-collapse id="collapse-id2" [orientation]="'horizontal'">
  <span>Collapse Content</span>
</rlb-collapse>`;

sc: string = `<p>{{message}}</p>
<button rlb-button toggle="collapse" toggle-target="collapse-id3">Collapse</button>
<rlb-collapse id="collapse-id3" (statusChange)="onStatusChange($event, 0)">
  <span>Collapse Content</span>
</rlb-collapse`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './collapse.component.html',
})
export class CollapesesComponent {

  message: number = 0;

  onStatusChange(event: any, i: number){
    this.message++;
  }
}`;
}
