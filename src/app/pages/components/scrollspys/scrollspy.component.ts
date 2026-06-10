import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

@Component({
  selector: 'app-scrollspy',
  templateUrl: './scrollspy.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class ScrollspysComponent {
  message = 0;

  onScrollChange(event: Event) {
    this.message++;
  }

  basicExample = `<rlb-nav id="scroll-nav" horizontal-alignment="center" vertical="false" fill="true" pills="true">
  <rlb-nav-item [href]="'#section1'">Section 1</rlb-nav-item>
  <rlb-nav-item [href]="'#section2'">Section 2</rlb-nav-item>
  <rlb-nav-item [href]="'#section3'">Section 3</rlb-nav-item>
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

  rootMarginExample = `<rlb-nav id="scroll-nav2" horizontal-alignment="center" vertical="false" fill="true" pills="true">
  <rlb-nav-item [href]="'#rm-section1'">Section 1</rlb-nav-item>
  <rlb-nav-item [href]="'#rm-section2'">Section 2</rlb-nav-item>
  <rlb-nav-item [href]="'#rm-section3'">Section 3</rlb-nav-item>
</rlb-nav>
<div
  rlb-scrollspy
  [rlb-scrollspy-target]="'#scroll-nav2'"
  [height]="'150px'"
  [scroll-root-margin]="'0px 0px -50% 0px'">
  <h4 id="rm-section1">Section 1</h4>
  <p>...</p>
  <h4 id="rm-section2">Section 2</h4>
  <p>...</p>
  <h4 id="rm-section3">Section 3</h4>
  <p>...</p>
</div>`;

  thresholdExample = `<rlb-nav id="scroll-nav3" horizontal-alignment="center" vertical="false" fill="true" pills="true">
  <rlb-nav-item [href]="'#th-section1'">Section 1</rlb-nav-item>
  <rlb-nav-item [href]="'#th-section2'">Section 2</rlb-nav-item>
  <rlb-nav-item [href]="'#th-section3'">Section 3</rlb-nav-item>
</rlb-nav>
<div
  rlb-scrollspy
  [rlb-scrollspy-target]="'#scroll-nav3'"
  [height]="'150px'"
  [scroll-threshold]="[0, 0.5, 1]">
  <h4 id="th-section1">Section 1</h4>
  <p>...</p>
  <h4 id="th-section2">Section 2</h4>
  <p>...</p>
  <h4 id="th-section3">Section 3</h4>
  <p>...</p>
</div>`;

  scrollChangeExample = `<rlb-nav id="scroll-nav4" horizontal-alignment="center" vertical="false" fill="true" pills="true">
  <rlb-nav-item [href]="'#sc-section1'">Section 1</rlb-nav-item>
  <rlb-nav-item [href]="'#sc-section2'">Section 2</rlb-nav-item>
  <rlb-nav-item [href]="'#sc-section3'">Section 3</rlb-nav-item>
</rlb-nav>
<div
  rlb-scrollspy
  [rlb-scrollspy-target]="'#scroll-nav4'"
  [height]="'150px'"
  (scroll-change)="onScrollChange($event)">
  <h4 id="sc-section1">Section 1</h4>
  <p>...</p>
  <h4 id="sc-section2">Section 2</h4>
  <p>...</p>
  <h4 id="sc-section3">Section 3</h4>
  <p>...</p>
</div>`;

  lorem = LOREM;

  api: DocApiRow[] = [
    { name: 'rlb-scrollspy-target', type: 'string', description: 'CSS selector pointing to the navigation container that holds the anchor links (e.g. #nav). Required.', kind: 'Input' },
    { name: 'height', type: 'string', default: "'200px'", description: 'CSS height of the scrollable container. Accepts any valid CSS length value (e.g. 150px, 50vh).', kind: 'Input' },
    { name: 'scroll-smooth', type: 'boolean', default: 'true', description: 'Enables smooth scrolling animation when an anchor link is clicked.', kind: 'Input' },
    { name: 'scroll-root-margin', type: 'string', default: "''", description: 'IntersectionObserver root margin used to adjust when a section is considered visible (e.g. 0px 0px -50% 0px).', kind: 'Input' },
    { name: 'scroll-threshold', type: 'number[]', default: '[]', description: 'Array of intersection ratio thresholds (0–1) passed to IntersectionObserver to fine-tune activation timing.', kind: 'Input' },
    { name: 'scroll-change', type: 'Event', description: 'Fires whenever the active section changes. The payload is the native Bootstrap activate.bs.scrollspy event.', kind: 'Output' },
  ];
}
