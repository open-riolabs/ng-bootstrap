import { booleanAttribute, Component, computed, input } from '@angular/core';
import { Color } from "../../../shared/types";

@Component({
  selector: 'rlb-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  standalone: false,
})
export class RlbFabComponent {
  color = input<Color>('primary');

  size = input<'xs' | 'sm' | 'md' | 'lg'>('md');

  disabled = input(false, { transform: booleanAttribute });
  outline = input(false, { transform: booleanAttribute });

  position = input<'br' | 'bl' | 'tr' | 'tl' | undefined>(undefined);

  positionClass = computed(() => {
    let classes = '';
    const pos = this.position();
    if (pos) {
      classes += 'position-fixed ';
      switch (pos) {
        case 'bl':
          classes += 'fab-bottom-left';
          break;
        case 'tr':
          classes += 'fab-top-right';
          break;
        case 'tl':
          classes += 'fab-top-left';
          break;
        default:
          classes += 'fab-bottom-right';
      }
    }
    return classes;
  });

  sizeClass = computed(() => {
    switch (this.size()) {
      case 'xs': return 'fab-xs';
      case 'sm': return 'fab-sm';
      case 'lg': return 'fab-lg';
      default: return 'fab-md';
    }
  });
}

