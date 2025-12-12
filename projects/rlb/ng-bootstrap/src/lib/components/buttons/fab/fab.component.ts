import { booleanAttribute, Component, Input } from '@angular/core';
import { Color } from "../../../shared/types";

@Component({
  selector: 'rlb-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  standalone: false,
})
export class RlbFabComponent {
  @Input() color: Color = 'primary';

  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) outline = false;
  
  @Input() position: 'br' | 'bl' | 'tr' | 'tl' | undefined = undefined;

  get positionClass() {
    let classes = '';
    if (this.position) {
      classes += 'position-fixed ';
      switch (this.position) {
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
    return classes
  }

  get sizeClass() {
    switch (this.size) {
      case 'xs': return 'fab-xs';
      case 'sm': return 'fab-sm';
      case 'lg': return 'fab-lg';
      default:   return 'fab-md';
    }
  }
}

