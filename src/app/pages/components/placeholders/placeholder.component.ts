import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './placeholder.component.html',
})
export class PlaceholdersComponent {

  sample: string = `<div rlb-placeholder>
    <span>Testo</span>
</div>`;

  color: string = `<div rlb-placeholder [placeholder-color]="'primary'">
  <span>Testo</span>
</div>
<div rlb-placeholder [placeholder-color]="'secondary'">
  <span>Testo</span>
</div>  
<div rlb-placeholder [placeholder-color]="'success'">
  <span>Testo</span>
</div> 
<div rlb-placeholder [placeholder-color]="'danger'">
  <span>Testo</span>
</div> 
<div rlb-placeholder [placeholder-color]="'warning'">
  <span>Testo</span>
</div> 
<div rlb-placeholder [placeholder-color]="'info'">
  <span>Testo</span>
</div> 
<div rlb-placeholder [placeholder-color]="'light'">
  <span>Testo</span>
</div> 
<div rlb-placeholder [placeholder-color]="'dark'">
  <span>Testo</span>
</div>`;

  size: string = `<div rlb-placeholder [placeholder-size]="'xs'">
  <span>Testo</span>
</div><br>
<div rlb-placeholder [placeholder-size]="'sm'">
  <span>Testo</span>
</div><br>
<div rlb-placeholder [placeholder-size]="'md'">
  <span>Testo</span>
</div><br>
<div rlb-placeholder [placeholder-size]="'lg'">
  <span>Testo</span>
</div>`;

  animation: string = `<div rlb-placeholder [placeholder-animation]="'fade'">
  <span>Testo</span>
</div><br>
<div rlb-placeholder [placeholder-animation]="'glow'">
  <span>Testo</span>
</div><br>
<div rlb-placeholder [placeholder-animation]="'none'">
  <span>Testo</span>
</div>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './placeholder.component.html',
})
export class PlaceholdersComponent {}`;
}
