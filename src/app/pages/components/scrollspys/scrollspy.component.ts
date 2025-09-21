import { Component } from '@angular/core';

@Component({
    selector: 'app-scrollspy',
    templateUrl: './scrollspy.component.html',
    standalone: false
})
export class ScrollspysComponent {
	
	html: string = `<rlb-nav id="scroll-nav" horizontal-alignment="center" vertical="false" fill="true" pills="true">
 <rlb-nav-item [href]="'#section1'">
  Section 1
 </rlb-nav-item>
 <rlb-nav-item [href]="'#section2'">
  Section 2
 </rlb-nav-item>
 <rlb-nav-item [href]="'#section3'">
  Section 3
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
  
  scrollRootMargin: string = `<rlb-nav id="scroll-nav" horizontal-alignment="center" vertical="false" fill="true" pills="true">
 <rlb-nav-item [href]="'#section1'">
  Section 1
 </rlb-nav-item>
 <rlb-nav-item [href]="'#section2'">
  Section 2
 </rlb-nav-item>
 <rlb-nav-item [href]="'#section3'">
  Section 3
 </rlb-nav-item>
</rlb-nav>
<div
 rlb-scrollspy
 [rlb-scrollspy-target]="'#scroll-nav'"
 [height]="'150px'"
 [scroll-root-margin]="'0px 0px -50% 0px'">
	
 <h4 id="section1">Section 1</h4>
 <p>...</p>
 <h4 id="section2">Section 2</h4>
 <p>...</p>
 <h4 id="section3">Section 3</h4>
 <p>...</p>
</div>`;
  
  scrollThreshold: string = `<rlb-nav id="scroll-nav" horizontal-alignment="center" vertical="false" fill="true" pills="true">
 <rlb-nav-item [href]="'#section1'">
  Section 1
 </rlb-nav-item>
 <rlb-nav-item [href]="'#section2'">
  Section 2
 </rlb-nav-item>
 <rlb-nav-item [href]="'#section3'">
  Section 3
 </rlb-nav-item>
</rlb-nav>
<div
 rlb-scrollspy
 [rlb-scrollspy-target]="'#scroll-nav'"
 [height]="'150px'"
 [scroll-threshold]="[0, 0.5, 1]">
	
 <h4 id="section1">Section 1</h4>
 <p>...</p>
 <h4 id="section2">Section 2</h4>
 <p>...</p>
 <h4 id="section3">Section 3</h4>
 <p>...</p>
</div>`;
  
  scrollChange: string = `<rlb-nav id="scroll-nav" horizontal-alignment="center" vertical="false" fill="true" pills="true">
 <rlb-nav-item [href]="'#section1'">
  Section 1
 </rlb-nav-item>
 <rlb-nav-item [href]="'#section2'">
  Section 2
 </rlb-nav-item>
 <rlb-nav-item [href]="'#section3'">
  Section 3
 </rlb-nav-item>
</rlb-nav>
<div
 rlb-scrollspy
 (scroll-change)="onScrollChange($event)"
 [rlb-scrollspy-target]="'#scroll-nav'"
 [height]="'150px'">
	
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
  
  message = 0;
  
  onScrollChange(event: Event) {
    // console.log(event);
    this.message++
  }
}
