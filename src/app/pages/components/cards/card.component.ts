import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class CardsComponent {
  basicExample = `<rlb-card>
  <rlb-card-body>
    <h5 rlb-card-title>Card title</h5>
    <p rlb-card-text>Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </rlb-card-body>
</rlb-card>`;

  headerFooterExample = `<rlb-card>
  <rlb-card-header>Featured</rlb-card-header>
  <rlb-card-body>
    <h5 rlb-card-title>Special title treatment</h5>
    <p rlb-card-text>With supporting text below as a natural lead-in to additional content.</p>
  </rlb-card-body>
  <rlb-card-footer>
    <small class="text-body-secondary">Last updated 3 mins ago</small>
  </rlb-card-footer>
</rlb-card>`;

  alignExample = `<rlb-card align="left">
  <rlb-card-body>
    <h5 rlb-card-title>Left aligned (default)</h5>
    <p rlb-card-text>Card body content aligned to the left.</p>
  </rlb-card-body>
</rlb-card>

<rlb-card align="center">
  <rlb-card-body>
    <h5 rlb-card-title>Center aligned</h5>
    <p rlb-card-text>Card body content aligned to the center.</p>
  </rlb-card-body>
</rlb-card>

<rlb-card align="right">
  <rlb-card-body>
    <h5 rlb-card-title>Right aligned</h5>
    <p rlb-card-text>Card body content aligned to the right.</p>
  </rlb-card-body>
</rlb-card>`;

  overlayExample = `<rlb-card [overlay]="true" style="max-width: 18rem;">
  <img rlb-card-image src="https://placehold.co/600x200" alt="Card image">
  <rlb-card-body>
    <h5 rlb-card-title>Card image overlay</h5>
    <p rlb-card-text>This text is rendered on top of the card image.</p>
  </rlb-card-body>
</rlb-card>`;

  backgroundExample = `<rlb-card background="primary">
  <rlb-card-body>
    <h5 rlb-card-title>Primary</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card background="secondary">
  <rlb-card-body>
    <h5 rlb-card-title>Secondary</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card background="success">
  <rlb-card-body>
    <h5 rlb-card-title>Success</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card background="danger">
  <rlb-card-body>
    <h5 rlb-card-title>Danger</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card background="warning">
  <rlb-card-body>
    <h5 rlb-card-title>Warning</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card background="info">
  <rlb-card-body>
    <h5 rlb-card-title>Info</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card background="light">
  <rlb-card-body>
    <h5 rlb-card-title>Light</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card background="dark">
  <rlb-card-body>
    <h5 rlb-card-title>Dark</h5>
  </rlb-card-body>
</rlb-card>`;

  borderExample = `<rlb-card border="primary">
  <rlb-card-body>
    <h5 rlb-card-title>Primary border</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card border="secondary">
  <rlb-card-body>
    <h5 rlb-card-title>Secondary border</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card border="success">
  <rlb-card-body>
    <h5 rlb-card-title>Success border</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card border="danger">
  <rlb-card-body>
    <h5 rlb-card-title>Danger border</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card border="warning">
  <rlb-card-body>
    <h5 rlb-card-title>Warning border</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card border="info">
  <rlb-card-body>
    <h5 rlb-card-title>Info border</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card border="light">
  <rlb-card-body>
    <h5 rlb-card-title>Light border</h5>
  </rlb-card-body>
</rlb-card>
<rlb-card border="dark">
  <rlb-card-body>
    <h5 rlb-card-title>Dark border</h5>
  </rlb-card-body>
</rlb-card>`;

  groupExample = `<rlb-card-group>
  <rlb-card>
    <rlb-card-body>
      <h5 rlb-card-title>Card title</h5>
      <p rlb-card-text>This is a wider card with supporting text below.</p>
    </rlb-card-body>
    <rlb-card-footer>
      <small class="text-body-secondary">Last updated 3 mins ago</small>
    </rlb-card-footer>
  </rlb-card>
  <rlb-card>
    <rlb-card-body>
      <h5 rlb-card-title>Card title</h5>
      <p rlb-card-text>This card has supporting text below as a natural lead-in to additional content.</p>
    </rlb-card-body>
    <rlb-card-footer>
      <small class="text-body-secondary">Last updated 8 mins ago</small>
    </rlb-card-footer>
  </rlb-card>
  <rlb-card>
    <rlb-card-body>
      <h5 rlb-card-title>Card title</h5>
      <p rlb-card-text>This is a wider card with supporting text below as a natural lead-in.</p>
    </rlb-card-body>
    <rlb-card-footer>
      <small class="text-body-secondary">Last updated 5 mins ago</small>
    </rlb-card-footer>
  </rlb-card>
</rlb-card-group>`;

  cardApi: DocApiRow[] = [
    { name: 'align', type: "TextAlignment", default: "'left'", description: "Text alignment inside the card. Accepts 'left', 'center', or 'right'.", kind: 'Input' },
    { name: 'overlay', type: 'boolean', default: 'false', description: 'When true, converts the card image into a background and overlays the card body content on top of it.', kind: 'Input' },
    { name: 'background', type: 'Color | undefined', default: 'undefined', description: 'Bootstrap contextual color applied as a background (text-bg-* utility). Accepts primary, secondary, success, danger, warning, info, light, dark.', kind: 'Input' },
    { name: 'border', type: 'Color | undefined', default: 'undefined', description: 'Bootstrap contextual color applied as a border (border-* utility). Accepts primary, secondary, success, danger, warning, info, light, dark.', kind: 'Input' },
  ];

  cardBodyApi: DocApiRow[] = [
    { name: '(content)', type: '[rlb-card-title], [rlb-card-subtitle], [rlb-card-text], [rlb-card-link], other', description: 'Place card content inside the body. Use the rlb-card-title, rlb-card-subtitle, rlb-card-text and rlb-card-link attribute selectors for structured content.', kind: 'Content' },
  ];

  cardImageApi: DocApiRow[] = [
    { name: 'position', type: "'top' | 'bottom'", default: "'top'", description: "Position of the image relative to the card. 'top' adds card-img-top; 'bottom' adds card-img-bottom. When the parent card has overlay enabled, card-img is used instead.", kind: 'Input' },
  ];
}
