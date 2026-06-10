import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class ChatsComponent {
  lastReply?: string;

  // Inline SVG avatars — no network dependency.
  avatarA = ChatsComponent.avatar('#0d6efd', 'A');
  avatarB = ChatsComponent.avatar('#198754', 'B');

  private static avatar(bg: string, initial: string): string {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">` +
      `<circle cx="20" cy="20" r="20" fill="${bg}"/>` +
      `<text x="20" y="26" font-size="18" fill="#fff" text-anchor="middle" font-family="sans-serif">${initial}</text>` +
      `</svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  onReply(id: string | undefined) {
    this.lastReply = id;
  }

  basicExample = `<rlb-chat-container>
  <rlb-chat-item
    avatar="https://i.pravatar.cc/40?img=5"
    position="left"
    date-time="10:30">
    Hi! How are you doing today?
  </rlb-chat-item>

  <rlb-chat-item
    avatar="https://i.pravatar.cc/40?img=12"
    position="right"
    date-time="10:31">
    Great, thanks! Working on the new docs.
  </rlb-chat-item>
</rlb-chat-container>`;

  reactionReplyExample = `<rlb-chat-container>
  <rlb-chat-item
    avatar="https://i.pravatar.cc/40?img=5"
    position="left"
    date-time="10:30"
    replay-subject="You"
    replay-text="Great, thanks! Working on the new docs.">
    Nice, can't wait to see them!
  </rlb-chat-item>

  <rlb-chat-item
    avatar="https://i.pravatar.cc/40?img=12"
    position="right"
    date-time="10:31"
    reaction="❤️"
    can-reply
    (reply)="onReply($event)">
    Great, thanks! Working on the new docs.
  </rlb-chat-item>
</rlb-chat-container>`;

  containerApi: DocApiRow[] = [
    {
      name: 'rlb-chat-container',
      type: 'Content projection (ng-content)',
      description: 'Projects one or more rlb-chat-item elements. No configurable inputs.',
      kind: 'Content',
    },
  ];

  itemApi: DocApiRow[] = [
    { name: 'id', type: 'string', default: "''", description: 'Optional identifier for the message bubble, emitted with the reply output.', kind: 'Input' },
    { name: 'avatar', type: 'string', default: "''", description: 'URL of the sender avatar image displayed beside the bubble.', kind: 'Input' },
    { name: 'date-time', type: 'string | undefined', default: "''", description: 'Timestamp label shown inside the bubble.', kind: 'Input' },
    { name: 'position', type: "'left' | 'right'", default: "'left'", description: 'Aligns the bubble to the left (incoming) or right (outgoing) side.', kind: 'Input' },
    { name: 'reaction', type: 'string | undefined', default: '—', description: 'Emoji displayed as a reaction badge on the bubble. Click removes it (emits reaction-click with "remove").', kind: 'Input' },
    { name: 'hide-reaction-picker', type: 'boolean', default: 'false', description: 'Hides the + reaction-picker trigger when true.', kind: 'Input' },
    { name: 'can-reply', type: 'boolean', default: 'false', description: 'Shows a reply button on the bubble; clicking it emits the reply output.', kind: 'Input' },
    { name: 'replay-subject', type: 'string | undefined', default: '—', description: 'Author name shown in the quoted-reply context block.', kind: 'Input' },
    { name: 'replay-text', type: 'string | undefined', default: '—', description: 'Message text shown in the quoted-reply context block.', kind: 'Input' },
    { name: 'replay-id', type: 'string | undefined', default: '—', description: 'Id of the message being replied to; emitted as the reply payload.', kind: 'Input' },
    { name: 'reply', type: 'string | undefined', description: 'Emitted when the reply button is clicked; payload is the replay-id value.', kind: 'Output' },
    { name: 'reaction-click', type: 'string', description: 'Emitted when the user clicks an existing reaction (payload is "remove").', kind: 'Output' },
    { name: 'reaction-selector', type: "'show' | 'shown' | 'hide' | 'hidden'", description: 'Emitted when the reaction-picker dropdown visibility changes.', kind: 'Output' },
  ];
}
