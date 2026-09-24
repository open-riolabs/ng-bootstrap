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

  splitExample = `<rlb-split-button color="primary" (action)="save()">
  Save
  <li><a class="dropdown-item" href="#">Save and close</a></li>
  <li><a class="dropdown-item" href="#">Save as draft</a></li>
</rlb-split-button>`;

  splitOptionsExample = `<rlb-split-button color="secondary" outline size="sm">…</rlb-split-button>
<rlb-split-button color="danger" icon="bi bi-trash">…</rlb-split-button>
<rlb-split-button menu-disabled>…</rlb-split-button>`;

  splitApi: DocApiRow[] = [
    { name: 'color', type: 'Color', default: "'primary'", description: 'Bootstrap colour for both halves.', kind: 'Input' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | undefined", default: "'md'", description: 'Size of the whole group.', kind: 'Input' },
    { name: 'outline', type: 'boolean', default: 'false', description: 'Outlined rather than filled.', kind: 'Input' },
    { name: 'icon', type: 'string | undefined', default: 'undefined', description: 'Icon classes drawn before the label of the main button.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both halves.', kind: 'Input' },
    { name: 'menu-disabled', type: 'boolean', default: 'false', description: 'Disables only the arrow, for when there is nothing else to offer yet.', kind: 'Input' },
    { name: 'menu-align', type: "'start' | 'end'", default: "'start'", description: 'Which edge the menu lines up with. Starts on the left, as Bootstrap’s own split button does; end is for the button at the right-hand edge of a toolbar.', kind: 'Input' },
    { name: 'menuLabel', type: 'string', default: "'More actions'", description: 'What the arrow is called. It has no text of its own, so without this a screen reader announces «button» and stops — beside another button that does have a name.', kind: 'Input' },
    { name: 'action', type: 'EventEmitter<MouseEvent>', description: 'The main button was pressed. The menu items emit their own.', kind: 'Output' },
    { name: '(default slot)', type: 'content', description: 'The label of the main button.', kind: 'Content' },
    { name: 'li / [rlb-dropdown-item]', type: 'content', description: 'The menu, projected into the dropdown — the same items as anywhere else in the library.', kind: 'Content' },
  ];

  api: DocApiRow[] = [
    { name: 'color', type: 'Color', default: "'primary'", description: 'Bootstrap contextual color of the button (primary, secondary, success, danger, warning, info, light, dark).', kind: 'Input' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size.', kind: 'Input' },
    { name: 'outline', type: 'boolean', default: 'false', description: 'Render with an outlined style instead of a solid background.', kind: 'Input' },
    { name: 'isLink', type: 'boolean', default: 'false', description: 'Render the button as a link (btn-link) styled with the chosen color.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button and block pointer events.', kind: 'Input' },
  ];
}
