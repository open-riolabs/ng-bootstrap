import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: false
})
export class ButtonsComponent {

  copyToClipboard(code: string) {
    navigator.clipboard.writeText(code);
  }

  baseDirectiveExample: string = `<button rlb-button>Primary</button>`;
  variantsExample: string = `
<button rlb-button color="primary">Primary</button>
<button rlb-button color="secondary">Secondary</button>
<button rlb-button color="success">Success</button>
<button rlb-button color="danger">Danger</button>
<button rlb-button color="warning">Warning</button>
<button rlb-button color="info">Info</button>
<button rlb-button color="light">Light</button>
<button rlb-button color="dark">Dark</button>
<button rlb-button isLink>Link</button>
`;

  typesExample: string = `
<a rlb-button href="#" role="button">Link</a>
<button rlb-button type="button">Button</button>
<input class="btn btn-primary" type="button" value="Input">
<button rlb-button type="submit">Submit</button>
<button rlb-button type="reset">Reset</button>
`;

  outlineExample: string = `
<button rlb-button outline color="primary">Primary</button>
<button rlb-button outline color="secondary">Secondary</button>
<button rlb-button outline color="success">Success</button>
<button rlb-button outline color="danger">Danger</button>
<button rlb-button outline color="warning">Warning</button>
<button rlb-button outline color="info">Info</button>
<button rlb-button outline color="light">Light</button>
<button rlb-button outline color="dark">Dark</button>
`;

  sizesExample: string = `
<button rlb-button color="primary" size="sm">Small Button</button>
<button rlb-button color="secondary" size="md">Normal Button</button>
<button rlb-button color="info" size="lg">Large Button</button>
`;

  disableExample: string = `
<button rlb-button color="primary" disabled>Primary button</button>
<button rlb-button color="secondary" disabled>Button</button>
<button rlb-button color="primary" outline disabled>Primary button</button>
<button rlb-button color="secondary" outline disabled>Button</button>
`;

}
