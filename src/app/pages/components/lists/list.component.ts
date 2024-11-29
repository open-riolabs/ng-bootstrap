import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './list.component.html',
    standalone: false
})
export class ListsComponent {

  sample: string = `<rlb-list>
  <rlb-list-item>pippo</rlb-list-item>
  <rlb-list-item>pluto</rlb-list-item>
  <rlb-list-item>paperino</rlb-list-item>
</rlb-list>`;

  disabled: string = `<rlb-list [disabled]="true">
  <rlb-list-item>pippo</rlb-list-item>
  <rlb-list-item>pluto</rlb-list-item>
  <rlb-list-item>paperino</rlb-list-item>
</rlb-list>`;
  
  numbered: string = `<rlb-list [numbered]="true">
  <rlb-list-item>pippo</rlb-list-item>
  <rlb-list-item>pluto</rlb-list-item>
  <rlb-list-item>paperino</rlb-list-item>
</rlb-list>`;
  
  flush: string = `<rlb-list [flush]="true">
  <rlb-list-item>pippo</rlb-list-item>
  <rlb-list-item>pluto</rlb-list-item>
  <rlb-list-item>paperino</rlb-list-item>
</rlb-list>`;
  
  horizontal: string = `<rlb-list [horizontal]="true">
  <rlb-list-item>pippo</rlb-list-item>
  <rlb-list-item>pluto</rlb-list-item>
  <rlb-list-item>paperino</rlb-list-item>
</rlb-list>`;
  
  active: string = `<rlb-list>
  <rlb-list-item [active]="true">pippo</rlb-list-item>
  <rlb-list-item>pluto</rlb-list-item>
  <rlb-list-item>paperino</rlb-list-item>
</rlb-list>`;
  
  disabled2: string = `<rlb-list>
  <rlb-list-item [disabled]="true">pippo</rlb-list-item>
  <rlb-list-item>pluto</rlb-list-item>
  <rlb-list-item>paperino</rlb-list-item>
</rlb-list>`;
  
  action: string = `<rlb-list>
  <rlb-list-item [action]="true">pippo</rlb-list-item>
  <rlb-list-item>pluto</rlb-list-item>
  <rlb-list-item>paperino</rlb-list-item>
</rlb-list>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './list.component.html',
})
export class ListsComponent {}`;
}
