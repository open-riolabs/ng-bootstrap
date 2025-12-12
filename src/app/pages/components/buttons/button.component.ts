import { Component } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    standalone: false
})
export class ButtonsComponent {

color: string = `<button rlb-button [color]="'primary'">Search</button>
<button rlb-button [color]="'secondary'">Search</button>
<button rlb-button [color]="'success'">Search</button>
<button rlb-button [color]="'danger'">Search</button>
<button rlb-button [color]="'warning'">Search</button>
<button rlb-button [color]="'info'">Search</button>
<button rlb-button [color]="'light'">Search</button>
<button rlb-button [color]="'dark'">Search</button>`;

  size: string = `<button rlb-button [size]="'sm'">Search</button>
<button rlb-button [size]="'md'">Search</button>
<button rlb-button [size]="'lg'">Search</button>`;

  disabled: string = `<button rlb-button [disabled]="true">Search</button>`;

  outline: string = `<button rlb-button [outline]="true">Search</button>`;

  isLink: string = `<button rlb-button [isLink]="true">Search</button>`;

  fab: string = `<h4>FAB</h4>
 <div class="d-flex gap-3 flex-wrap align-items-center">
   <rlb-fab>
     <i class="bi bi-plus"></i>
   </rlb-fab>
 </div>

 <h4>Colors</h4>
 <div class="d-flex gap-3 flex-wrap align-items-center">
   <rlb-fab color="primary"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab color="secondary"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab color="success"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab color="danger"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab color="warning"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab color="info"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab color="light"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab color="dark"><i class="bi bi-plus"></i></rlb-fab>
 </div>

 <h4>Sizes</h4>
 <div class="d-flex gap-3 flex-wrap align-items-center">
   <rlb-fab size="xs"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab size="sm"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab size="md"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab size="lg"><i class="bi bi-plus"></i></rlb-fab>
 </div>

 <h4>Outline</h4>
 <div class="d-flex gap-3 flex-wrap align-items-center">
   <rlb-fab outline color="primary"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab outline color="secondary"><i class="bi bi-plus"></i></rlb-fab>
   <rlb-fab outline color="danger"><i class="bi bi-plus"></i></rlb-fab>
 </div>

 <h4>Disabled</h4>
 <div class="d-flex gap-3 flex-wrap align-items-center">
   <rlb-fab disabled><i class="bi bi-slash-circle"></i></rlb-fab>
 </div>
`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './button.component.html',
})
export class ButtonsComponent {}`;
}
