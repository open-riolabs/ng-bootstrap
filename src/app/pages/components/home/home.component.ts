import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS } from '../../../shared/docs';

interface CompLink {
  name: string;
  icon: string;
  desc: string;
  link: string;
}

interface CompGroup {
  title: string;
  items: CompLink[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class HomeComponent {
  groups: CompGroup[] = [
    {
      title: 'Actions',
      items: [
        { name: 'Button', icon: 'bi-hand-index', desc: 'Clickable button directive with colors, sizes and outline styles.', link: '/components/buttons' },
        { name: 'Badge', icon: 'bi-person-badge', desc: 'Small count and labelling indicators.', link: '/components/badges' },
        { name: 'Dropdowns', icon: 'bi-menu-button-fill', desc: 'Toggleable contextual menus.', link: '/components/dropdowns' },
      ],
    },
    {
      title: 'Layout & containers',
      items: [
        { name: 'Card', icon: 'bi-card-heading', desc: 'Flexible content container with header, body and footer.', link: '/components/cards' },
        { name: 'List', icon: 'bi-list-ul', desc: 'List groups for series of content.', link: '/components/lists' },
        { name: 'DataTable', icon: 'bi-table', desc: 'Tables with sorting, filtering, pagination and actions.', link: '/components/tables' },
        { name: 'Placeholder', icon: 'bi-bounding-box', desc: 'Loading placeholders for content skeletons.', link: '/components/placeholders' },
        { name: 'Sidebar', icon: 'bi-layout-sidebar-inset', desc: 'Vertical, collapsible navigation menu.', link: '/components/sidebars' },
      ],
    },
    {
      title: 'Navigation',
      items: [
        { name: 'Navbar', icon: 'bi-window-sidebar', desc: 'Responsive top navigation bar.', link: '/components/navigation/navbars' },
        { name: 'Nav', icon: 'bi-segmented-nav', desc: 'Base navigation links and pills.', link: '/components/navigation/navs' },
        { name: 'Tabs', icon: 'bi-menu-button-wide', desc: 'Tabbed panes of content.', link: '/components/tabs' },
        { name: 'Breadcrumb', icon: 'bi-signpost-split', desc: 'Indicate the current page location.', link: '/components/breadcrumbs' },
        { name: 'Pagination', icon: 'bi-three-dots', desc: 'Paginate across series of pages.', link: '/components/paginations' },
        { name: 'Scrollspy', icon: 'bi-binoculars', desc: 'Highlight nav links based on scroll position.', link: '/components/scrollspys' },
      ],
    },
    {
      title: 'Overlays & feedback',
      items: [
        { name: 'Alerts', icon: 'bi-exclamation-triangle', desc: 'Contextual feedback messages.', link: '/components/alerts' },
        { name: 'Toasts', icon: 'bi-bell', desc: 'Lightweight push notifications.', link: '/components/toasts' },
        { name: 'Modals', icon: 'bi-window', desc: 'Dialogs for lightboxes and notifications.', link: '/components/modals' },
        { name: 'Offcanvas', icon: 'bi-layout-sidebar', desc: 'Hidden sidebars for navigation or content.', link: '/components/offcanvass' },
        { name: 'Tooltips', icon: 'bi-question-circle', desc: 'Contextual hints on hover or focus.', link: '/components/tooltips' },
        { name: 'Loader', icon: 'bi-arrow-clockwise', desc: 'Spinners and progress indicators.', link: '/components/loaders' },
      ],
    },
    {
      title: 'Disclosure',
      items: [
        { name: 'Accordions', icon: 'bi-chevron-bar-expand', desc: 'Vertically stacked, expandable panels.', link: '/components/accordions' },
        { name: 'Collapses', icon: 'bi-arrows-collapse', desc: 'Toggle the visibility of content.', link: '/components/collapses' },
      ],
    },
    {
      title: 'Media & content',
      items: [
        { name: 'Avatar', icon: 'bi-person-bounding-box', desc: 'User avatars with sizes and shapes.', link: '/components/avatars' },
        { name: 'Carousel', icon: 'bi-images', desc: 'Slideshow for cycling through content.', link: '/components/carousels' },
        { name: 'Wizard', icon: 'bi-ui-checks', desc: 'Multi-step forms built on the carousel.', link: '/components/wizards' },
        { name: 'Chat', icon: 'bi-chat-dots', desc: 'Conversation bubbles with replies and reactions.', link: '/components/chats' },
        { name: 'Calendar', icon: 'bi-calendar4-range', desc: 'Timezone-aware month, week and day calendar.', link: '/components/calendar' },
      ],
    },
  ];
}
