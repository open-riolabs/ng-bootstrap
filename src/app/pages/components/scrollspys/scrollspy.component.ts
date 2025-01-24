import { Component } from '@angular/core';

@Component({
    selector: 'app-scrollspy',
    templateUrl: './scrollspy.component.html',
    standalone: false
})
export class ScrollspysComponent {

  html: string = `<button rlb-button rlb-scrollspy="1">
  text
</button>
<h1 id="1">header</h1>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './scrollspy.component.html',
})
export class ScrollspysComponent {}`;
}
