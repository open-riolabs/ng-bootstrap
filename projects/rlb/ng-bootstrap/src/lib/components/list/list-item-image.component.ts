import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  numberAttribute
} from '@angular/core';
import { Color } from '../../shared/types';
import { ListComponent } from './list.component';

@Component({
  selector: 'rlb-list-item-image',
  template: `
    <div class="d-flex">
      @if (avatar()) {
        <rlb-avatar [src]="avatar()!" [size]="avatarSize()" />
      }
      @if (!avatar() && icon()) {
        <i [class]="icon()" [style.font-size.px]="avatarSize()"></i>
      }
      <div class="ps-2 flex-grow-1">
        <div class="fw-bold">{{ username() }}</div>
        @if (line1()) {
          <span class="d-block">{{ line1() }}</span>
        }
        @if (line2()) {
          <span class="d-block">{{ line2() }}</span>
        }
      </div>
      @if (counter() !== undefined || counterEmpty()) {
        <div>
          @if (counterEmpty()) {
            <span rlb-badge [pill]="counterPill()" [color]="counterColor()" [border]="counterBorder()">&nbsp;</span>
          } @else {
            <span rlb-badge [pill]="counterPill()" [color]="counterColor()" [border]="counterBorder()">{{ counter() }}</span>
          }
        </div>
      }
    </div>
  `,
  host: {
    class: 'list-group-item',
    '[class.disabled]': 'disabled()',
    '[class.list-group-item-action]': 'disabled() !== true',
    '[class.active]': 'active()',
    '[attr.aria-current]': 'active()',
  },
  standalone: false
})
export class ListItemImageComponent {
  private parent = inject(ListComponent, { optional: true });

  active = input(false, { transform: booleanAttribute });
  disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  counterEmpty = input(false, { transform: booleanAttribute, alias: 'counter-empty' });
  counterPill = input(false, { transform: booleanAttribute, alias: 'counter-pill' });
  counterBorder = input(false, { transform: booleanAttribute, alias: 'counter-border' });
  avatarSize = input(50, { transform: numberAttribute, alias: 'avatar-size' });
  username = input<string | undefined>(undefined);
  line1 = input<string | undefined>(undefined, { alias: 'line-1' });
  line2 = input<string | undefined>(undefined, { alias: 'line-2' });
  avatar = input<string | undefined>(undefined);
  counter = input<number | string | undefined>(undefined);
  counterColor = input<Color | undefined>(undefined, { alias: 'counter-color' });
  icon = input<string | undefined>(undefined);

  disabled = computed(() => this.disabledInput() || this.parent?.disabled() || false);
}
