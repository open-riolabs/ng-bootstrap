import { Component } from '@angular/core';

@Component({
    selector: 'app-scrollspy',
    templateUrl: './scrollspy.component.html',
    standalone: false
})
export class ScrollspysComponent {
	
	html: string = `<rlb-nav id="scroll-nav" horizontal-alignment="center" vertical="false" fill="true" pills="true">
 <rlb-nav-item>
 	<a class="nav-link active" href="#section1">Section 1</a>
 </rlb-nav-item>
 <rlb-nav-item>
 	<a class="nav-link" href="#section2">Section 2</a>
 </rlb-nav-item>
 <rlb-nav-item>
 	<a class="nav-link" href="#section3">Section 3</a>
 </rlb-nav-item>
</rlb-nav>
<div
 rlb-scrollspy
 [rlb-scrollspy-target]="'#scroll-nav'"
 [height]="'150px'"
 scroll-smooth="true">
	
 <h4 id="section1">Section 1</h4>
 <p>...</p>
 <h4 id="section2">Section 2</h4>
 <p>...</p>
 <h4 id="section3">Section 3</h4>
 <p>...</p>
</div>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './scrollspy.component.html',
})
export class ScrollspysComponent {}`;
}
