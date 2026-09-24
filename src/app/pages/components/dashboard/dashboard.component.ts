import { Component } from '@angular/core';
import { DateTz } from '@open-rlb/date-tz';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class DashboardComponent {
  readonly zone = 'Europe/Rome';

  readonly revenueSpark = [12, 15, 14, 19, 18, 24, 27];
  readonly latencySpark = [180, 172, 165, 160, 158, 149, 141];

  readonly morning = DateTz.parse('2026-09-23 09:12', 'YYYY-MM-DD HH:mm', this.zone);
  readonly afternoon = DateTz.parse('2026-09-23 16:40', 'YYYY-MM-DD HH:mm', this.zone);
  readonly night = DateTz.parse('2026-09-24 00:30', 'YYYY-MM-DD HH:mm', this.zone);
  readonly later = DateTz.parse('2026-09-24 08:05', 'YYYY-MM-DD HH:mm', this.zone);

  statExample = `<rlb-stat
  label="Revenue"
  value="12.480 €"
  [delta]="12"
  delta-label="vs last month"
  icon="bi bi-cash-coin"
  [sparkline]="[12, 15, 14, 19, 18, 24, 27]"
/>`;

  invertExample = `<!-- Down is the good news here, so the colour flips while the arrow does not. -->
<rlb-stat
  label="p95 latency"
  value="141 ms"
  [delta]="-22"
  invert-delta
  color="info"
  icon="bi bi-speedometer2"
/>`;

  timelineExample = `<rlb-timeline group-by-day timezone="Europe/Rome" day-format="WL DD LM yyyy">
  <rlb-timeline-item [time]="morning" heading="Created" icon="bi bi-plus-lg">
    Mario opened the ticket.
  </rlb-timeline-item>
  <rlb-timeline-item [time]="afternoon" heading="Assigned" color="info">
    Given to the billing team.
  </rlb-timeline-item>
  <rlb-timeline-item [time]="night" heading="Escalated" color="warning">
    No answer within the SLA.
  </rlb-timeline-item>
  <rlb-timeline-item heading="Waiting on the customer" pending color="secondary">
    Nothing has happened yet.
  </rlb-timeline-item>
</rlb-timeline>`;

  statApi: DocApiRow[] = [
    { name: 'label', type: 'string', default: "''", description: 'What the number is.', kind: 'Input' },
    { name: 'value', type: 'string | number', default: "''", description: 'The number itself, already formatted. A component cannot know whether 1234.5 is money, a count or a percentage, nor in which locale — so formatting stays with the caller, who does.', kind: 'Input' },
    { name: 'delta', type: 'number | undefined', default: 'undefined', description: 'The change. Its sign decides the arrow and the colour. Left out, nothing is drawn.', kind: 'Input' },
    { name: 'delta-text', type: 'string | undefined', default: 'undefined', description: 'How the change is written. Left out, it is the delta with a sign and a %.', kind: 'Input' },
    { name: 'delta-label', type: 'string | undefined', default: 'undefined', description: 'The line under the number: «vs last month».', kind: 'Input' },
    { name: 'invert-delta', type: 'boolean', default: 'false', description: 'For metrics where down is good — churn, latency, cost. Swaps which direction is green without changing which arrow is drawn.', kind: 'Input' },
    { name: 'sparkline', type: 'number[]', default: '[]', description: 'Drawn as a line once there are two points. Decoration: the value and the delta already carry the meaning, so it is aria-hidden.', kind: 'Input' },
    { name: 'icon', type: 'string | undefined', default: 'undefined', description: 'An icon class.', kind: 'Input' },
    { name: 'color', type: 'Color', default: "'primary'", description: 'Tints the icon badge and the sparkline.', kind: 'Input' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a placeholder in place of the value.', kind: 'Input' },
    { name: 'flat', type: 'boolean', default: 'false', description: 'Drops the shadow and border, for a tile inside a card that already has one.', kind: 'Input' },
    { name: '(default)', type: 'ng-content', description: 'Anything extra, under the delta label.', kind: 'Content' },
  ];

  timelineApi: DocApiRow[] = [
    { name: 'group-by-day', type: 'boolean', default: 'false', description: 'Puts a heading above the first entry of each day. Only entries whose time is an IDateTz take part.', kind: 'Input' },
    { name: 'timezone', type: 'string | undefined', default: 'undefined', description: 'The zone the days are worked out in. From provideRlbDefaults when unset, else UTC. Getting this wrong moves entries into the wrong day.', kind: 'Input' },
    { name: 'locale', type: 'string', default: "'en'", description: 'Locale for the day heading.', kind: 'Input' },
    { name: 'time-format', type: 'string', default: "'HH:mm'", description: 'How a time is written beside each entry. date-tz tokens.', kind: 'Input' },
    { name: 'day-format', type: 'string', default: "'WL DD LM yyyy'", description: 'How a day heading is written.', kind: 'Input' },
    { name: 'compact', type: 'boolean', default: 'false', description: 'Tightens the spacing, for a long log.', kind: 'Input' },
  ];

  timelineItemApi: DocApiRow[] = [
    { name: 'heading', type: 'string | undefined', default: 'undefined', description: 'The line in bold.', kind: 'Input' },
    { name: 'time', type: 'IDateTz | string | undefined', default: 'undefined', description: 'An IDateTz is formatted by the timeline and groups by day; a plain string is printed as given and takes no part in grouping.', kind: 'Input' },
    { name: 'icon', type: 'string | undefined', default: 'undefined', description: 'An icon inside the dot. Left out, the dot is a plain circle.', kind: 'Input' },
    { name: 'color', type: 'Color', default: "'primary'", description: 'Colour of the dot.', kind: 'Input' },
    { name: 'pending', type: 'boolean', default: 'false', description: 'Hollows the dot out, for something that has not happened yet.', kind: 'Input' },
    { name: '(default)', type: 'ng-content', description: 'The detail under the heading.', kind: 'Content' },
  ];
}
