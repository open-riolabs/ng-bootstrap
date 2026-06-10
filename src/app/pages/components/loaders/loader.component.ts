import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class LoadersComponent {

  // ── Progress examples ────────────────────────────────────────────────────

  mmvExample = `<rlb-progress [min]="0" [max]="100" [value]="50"></rlb-progress>`;

  heightExample = `<rlb-progress [height]="3"></rlb-progress>`;

  animatedExample = `<rlb-progress [animated]="true" [value]="50"></rlb-progress>`;

  strippedExample = `<rlb-progress [striped]="true" [value]="50"></rlb-progress>`;

  infiniteExample = `<rlb-progress [infinite]="true" color="danger"></rlb-progress>`;

  showValueExample = `<rlb-progress [showValue]="true" [value]="50"></rlb-progress>`;

  progressColorExample = `<rlb-progress [value]="75" color="success"></rlb-progress>
<rlb-progress [value]="50" color="warning"></rlb-progress>
<rlb-progress [value]="25" color="danger"></rlb-progress>`;

  // ── Spinner examples ─────────────────────────────────────────────────────

  spinnerStyleExample = `<rlb-spinner [style]="'border'"></rlb-spinner>
<rlb-spinner [style]="'grow'"></rlb-spinner>`;

  spinnerColorExample = `<rlb-spinner [color]="'primary'"></rlb-spinner>
<rlb-spinner [color]="'secondary'"></rlb-spinner>
<rlb-spinner [color]="'success'"></rlb-spinner>
<rlb-spinner [color]="'danger'"></rlb-spinner>
<rlb-spinner [color]="'warning'"></rlb-spinner>
<rlb-spinner [color]="'info'"></rlb-spinner>
<rlb-spinner [color]="'light'"></rlb-spinner>
<rlb-spinner [color]="'dark'"></rlb-spinner>`;

  spinnerSizeExample = `<rlb-spinner [size]="'sm'"></rlb-spinner>
<rlb-spinner [size]="'md'"></rlb-spinner>
<rlb-spinner [size]="'lg'"></rlb-spinner>`;

  // ── API rows ─────────────────────────────────────────────────────────────

  progressApi: DocApiRow[] = [
    { name: 'value', type: 'number', default: '0', description: 'Current progress value. The displayed percentage is derived from (value - min) / (max - min) × 100.', kind: 'Input' },
    { name: 'min', type: 'number', default: '0', description: 'Minimum bound of the progress range.', kind: 'Input' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum bound of the progress range.', kind: 'Input' },
    { name: 'height', type: 'number', default: '—', description: 'Explicit height of the progress bar in pixels. Omit to use the Bootstrap default.', kind: 'Input' },
    { name: 'color', type: 'Color', default: "'primary'", description: 'Bootstrap contextual color applied to the progress bar fill.', kind: 'Input' },
    { name: 'text-color', type: 'Color', default: '—', description: 'Bootstrap contextual color applied to the text inside the progress bar.', kind: 'Input' },
    { name: 'striped', type: 'boolean', default: 'false', description: 'Add a striped pattern overlay to the progress bar fill.', kind: 'Input' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Animate the stripes (requires striped to have a visible effect).', kind: 'Input' },
    { name: 'infinite', type: 'boolean', default: 'false', description: 'Show an indeterminate / infinite animation instead of a fixed value.', kind: 'Input' },
    { name: 'showValue', type: 'boolean', default: 'false', description: 'Display the calculated percentage value as text inside the bar.', kind: 'Input' },
    { name: 'aria-label', type: 'string', default: '—', description: 'Accessible label forwarded to the aria-label attribute on the host element.', kind: 'Input' },
  ];

  spinnerApi: DocApiRow[] = [
    { name: 'style', type: "'border' | 'grow'", default: "'border'", description: "Spinner animation style: border renders a spinning ring; grow renders a pulsing dot.", kind: 'Input' },
    { name: 'color', type: 'Color', default: "'primary'", description: 'Bootstrap contextual color applied to the spinner.', kind: 'Input' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Spinner size. sm and lg map to Bootstrap size modifier classes; md is the default (no modifier).', kind: 'Input' },
  ];
}
