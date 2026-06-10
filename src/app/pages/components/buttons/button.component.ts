import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class ButtonsComponent {
  baseDirectiveExample = `<button rlb-button>Primary</button>`;

  variantsExample = `<button rlb-button color="primary">Primary</button>
<button rlb-button color="secondary">Secondary</button>
<button rlb-button color="success">Success</button>
<button rlb-button color="danger">Danger</button>
<button rlb-button color="warning">Warning</button>
<button rlb-button color="info">Info</button>
<button rlb-button color="light">Light</button>
<button rlb-button color="dark">Dark</button>
<button rlb-button isLink>Link</button>`;

  typesExample = `<a rlb-button href="#" role="button">Link</a>
<button rlb-button type="button">Button</button>
<input class="btn btn-primary" type="button" value="Input">
<button rlb-button type="submit">Submit</button>
<button rlb-button type="reset">Reset</button>`;

  outlineExample = `<button rlb-button outline color="primary">Primary</button>
<button rlb-button outline color="secondary">Secondary</button>
<button rlb-button outline color="success">Success</button>
<button rlb-button outline color="danger">Danger</button>`;

  sizesExample = `<button rlb-button color="primary" size="sm">Small Button</button>
<button rlb-button color="secondary" size="md">Normal Button</button>
<button rlb-button color="info" size="lg">Large Button</button>`;

  disableExample = `<button rlb-button color="primary" disabled>Primary button</button>
<button rlb-button color="secondary" disabled>Button</button>
<button rlb-button color="primary" outline disabled>Primary button</button>`;

  api: DocApiRow[] = [
    { name: 'color', type: 'Color', default: "'primary'", description: 'Bootstrap contextual color of the button (primary, secondary, success, danger, warning, info, light, dark).', kind: 'Input' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size.', kind: 'Input' },
    { name: 'outline', type: 'boolean', default: 'false', description: 'Render with an outlined style instead of a solid background.', kind: 'Input' },
    { name: 'isLink', type: 'boolean', default: 'false', description: 'Render the button as a link (btn-link) styled with the chosen color.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button and block pointer events.', kind: 'Input' },
  ];
}
