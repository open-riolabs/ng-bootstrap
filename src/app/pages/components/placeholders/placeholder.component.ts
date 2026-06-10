import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class PlaceholdersComponent {
  basicExample = `<rlb-placeholder-text/>`;

  colorExample = `<h6>primary</h6>
<rlb-placeholder-text color="primary"/>
<h6>secondary</h6>
<rlb-placeholder-text color="secondary"/>
<h6>success</h6>
<rlb-placeholder-text color="success"/>
<h6>danger</h6>
<rlb-placeholder-text color="danger"/>
<h6>info</h6>
<rlb-placeholder-text color="info"/>
<h6>warning</h6>
<rlb-placeholder-text color="warning"/>
<h6>light</h6>
<rlb-placeholder-text color="light"/>
<h6>dark</h6>
<rlb-placeholder-text color="dark"/>`;

  sizeExample = `<h6>xs</h6>
<rlb-placeholder-text size="xs"/>
<h6>sm</h6>
<rlb-placeholder-text size="sm"/>
<h6>md</h6>
<rlb-placeholder-text size="md"/>
<h6>lg</h6>
<rlb-placeholder-text size="lg"/>`;

  widthExample = `<h6>60%</h6>
<rlb-placeholder-text width="60%"/>
<h6>30%</h6>
<rlb-placeholder-text width="30%"/>
<h6>100%</h6>
<rlb-placeholder-text width="100%"/>`;

  animationExample = `<h6>glow</h6>
<rlb-placeholder-text size="lg" animation="glow"/>
<h6>wave</h6>
<rlb-placeholder-text size="lg" animation="wave"/>`;

  advancedExample = `<rlb-placeholder animation="glow">
  <rlb-placeholder-line width="100%"/>
  <rlb-placeholder-line width="80%" color="primary" size="sm"/>
  <rlb-placeholder-line width="60%" [rounded]="false"/>
</rlb-placeholder>`;

  apiPlaceholderText: DocApiRow[] = [
    { name: 'lines', type: 'number', default: '1', description: 'Number of placeholder lines to generate.', kind: 'Input' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls the height and font size of each placeholder line.', kind: 'Input' },
    { name: 'color', type: 'string', default: "'secondary'", description: 'Bootstrap contextual background color applied to each line.', kind: 'Input' },
    { name: 'animation', type: "'glow' | 'wave' | 'none'", default: "'none'", description: 'Applies a Bootstrap placeholder animation to the container.', kind: 'Input' },
    { name: 'width', type: 'string | string[]', default: "'100%'", description: 'Single width value applied to all lines, or an array of widths for individual lines.', kind: 'Input' },
    { name: 'height', type: 'string | undefined', default: 'undefined', description: 'Explicit height override for each line. Overrides the size-based height.', kind: 'Input' },
    { name: 'rounded', type: 'boolean', default: 'true', description: "Applies Bootstrap's rounded class to each placeholder line.", kind: 'Input' },
  ];

  apiPlaceholder: DocApiRow[] = [
    { name: 'animation', type: "'glow' | 'wave' | 'none'", default: "'none'", description: 'Applies a Bootstrap placeholder animation class to the container.', kind: 'Input' },
  ];

  apiPlaceholderLine: DocApiRow[] = [
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls the height and font size of the placeholder line.', kind: 'Input' },
    { name: 'color', type: 'string', default: "'secondary'", description: 'Bootstrap contextual background color of the placeholder line.', kind: 'Input' },
    { name: 'width', type: 'string', default: "'100%'", description: 'Width of the placeholder line (e.g. "100%", "60%").', kind: 'Input' },
    { name: 'height', type: 'string | undefined', default: "'1.5rem'", description: 'Explicit height override. When set, overrides the size-based height.', kind: 'Input' },
    { name: 'rounded', type: 'boolean', default: 'true', description: "Applies Bootstrap's rounded class to the placeholder line.", kind: 'Input' },
  ];
}
