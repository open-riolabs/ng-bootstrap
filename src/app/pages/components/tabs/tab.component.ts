import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class TabssComponent {
  basicExample = `<rlb-tabs>
  <rlb-tab target="home">Home</rlb-tab>
  <rlb-tab target="profile">Profile</rlb-tab>
  <rlb-tab target="messages">Messages</rlb-tab>
</rlb-tabs>
<rlb-tab-content>
  <rlb-tab-pane id="home" active>Home content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="profile">Profile content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="messages">Messages content goes here.</rlb-tab-pane>
</rlb-tab-content>`;

  pillsExample = `<rlb-tabs view="pills">
  <rlb-tab target="p-home">Home</rlb-tab>
  <rlb-tab target="p-profile">Profile</rlb-tab>
  <rlb-tab target="p-messages">Messages</rlb-tab>
</rlb-tabs>
<rlb-tab-content>
  <rlb-tab-pane id="p-home" active>Home content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="p-profile">Profile content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="p-messages">Messages content goes here.</rlb-tab-pane>
</rlb-tab-content>`;

  underlineExample = `<rlb-tabs view="underline">
  <rlb-tab target="u-home">Home</rlb-tab>
  <rlb-tab target="u-profile">Profile</rlb-tab>
  <rlb-tab target="u-messages">Messages</rlb-tab>
</rlb-tabs>
<rlb-tab-content>
  <rlb-tab-pane id="u-home" active>Home content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="u-profile">Profile content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="u-messages">Messages content goes here.</rlb-tab-pane>
</rlb-tab-content>`;

  fillExample = `<rlb-tabs fill="fill">
  <rlb-tab target="f-home">Home</rlb-tab>
  <rlb-tab target="f-profile">Profile</rlb-tab>
  <rlb-tab target="f-messages">Messages</rlb-tab>
</rlb-tabs>
<rlb-tab-content>
  <rlb-tab-pane id="f-home" active>Home content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="f-profile">Profile content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="f-messages">Messages content goes here.</rlb-tab-pane>
</rlb-tab-content>`;

  alignmentExample = `<rlb-tabs horizontal-alignment="center">
  <rlb-tab target="a-home">Home</rlb-tab>
  <rlb-tab target="a-profile">Profile</rlb-tab>
  <rlb-tab target="a-messages">Messages</rlb-tab>
</rlb-tabs>
<rlb-tab-content>
  <rlb-tab-pane id="a-home" active>Home content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="a-profile">Profile content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="a-messages">Messages content goes here.</rlb-tab-pane>
</rlb-tab-content>`;

  verticalExample = `<div class="d-flex gap-3">
  <rlb-tabs vertical view="pills">
    <rlb-tab target="v-home">Home</rlb-tab>
    <rlb-tab target="v-profile">Profile</rlb-tab>
    <rlb-tab target="v-messages">Messages</rlb-tab>
  </rlb-tabs>
  <rlb-tab-content class="flex-grow-1">
    <rlb-tab-pane id="v-home" active>Home content goes here.</rlb-tab-pane>
    <rlb-tab-pane id="v-profile">Profile content goes here.</rlb-tab-pane>
    <rlb-tab-pane id="v-messages">Messages content goes here.</rlb-tab-pane>
  </rlb-tab-content>
</div>`;

  disabledExample = `<rlb-tabs>
  <rlb-tab target="d-home" active>Home</rlb-tab>
  <rlb-tab target="d-profile">Profile</rlb-tab>
  <rlb-tab target="d-messages" disabled>Messages</rlb-tab>
</rlb-tabs>
<rlb-tab-content>
  <rlb-tab-pane id="d-home" active>Home content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="d-profile">Profile content goes here.</rlb-tab-pane>
  <rlb-tab-pane id="d-messages">Messages content goes here.</rlb-tab-pane>
</rlb-tab-content>`;

  tabsApi: DocApiRow[] = [
    { name: 'view', type: "'tab' | 'pills' | 'underline' | 'none'", default: "'tab'", description: 'Visual style of the navigation: tab borders, pills, underline, or unstyled.', kind: 'Input' },
    { name: 'horizontal-alignment', type: "'center' | 'end' | undefined", default: 'undefined', description: 'Horizontal alignment of the tab list; omit for left (default).', kind: 'Input' },
    { name: 'vertical', type: 'boolean', default: 'false', description: 'Stack tabs vertically (flex-column).', kind: 'Input' },
    { name: 'fill', type: "'fill' | 'justified' | undefined", default: 'undefined', description: "Expand tabs to fill available width. 'fill' makes widths proportional; 'justified' forces equal widths.", kind: 'Input' },
    { name: 'id', type: 'string | undefined', default: 'undefined', description: 'HTML id attribute placed on the inner <ul> element.', kind: 'Input' },
    { name: 'class', type: 'string', default: "''", description: 'Extra CSS classes forwarded to the inner <ul> element.', kind: 'Input' },
  ];

  tabApi: DocApiRow[] = [
    { name: 'target', type: 'string', description: 'Required. Must match the id of the corresponding <rlb-tab-pane>.', kind: 'Input' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Mark this tab as the initially active tab.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the tab button so it cannot be selected.', kind: 'Input' },
    { name: 'class', type: 'string', default: "''", description: 'Extra CSS classes forwarded to the inner <li> element.', kind: 'Input' },
  ];

  tabPaneApi: DocApiRow[] = [
    { name: 'id', type: 'string', description: 'Required. Must match the target of the corresponding <rlb-tab>.', kind: 'Input' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Show this pane as the initially visible panel.', kind: 'Input' },
    { name: 'fade', type: 'boolean', default: 'false', description: 'Enable a fade transition when the pane becomes active.', kind: 'Input' },
  ];
}
