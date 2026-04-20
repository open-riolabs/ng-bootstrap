import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RlbPlaceholderComponent } from './placeholder.component';
import { RlbPlaceholderLineComponent } from './placeholder-line.component';

@Component({
    selector: 'rlb-placeholder-text',
    template: `
    <rlb-placeholder [animation]="animation()">
      @for (w of computedWidths(); track w) {
        <rlb-placeholder-line
          [size]="size()"
          [color]="color()"
          [width]="w"
          [rounded]="rounded()"
          [height]="height()"
        ></rlb-placeholder-line>
      }
    </rlb-placeholder>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RlbPlaceholderComponent, RlbPlaceholderLineComponent],
})
export class RlbPlaceholderTextComponent {
  lines = input(1);
  size = input<'xs' | 'sm' | 'md' | 'lg'>('md');
  color = input('secondary');
  animation = input<'glow' | 'wave' | 'none'>('none');
  width = input<string | string[]>('100%');
  height = input<string | undefined>(undefined);
  rounded = input(true);

  computedWidths = computed(() => {
    const lines = this.lines();
    const width = this.width();
    if (Array.isArray(width)) {
      return Array.from({ length: lines }).map((_, i) => width[i] ?? '100%');
    }
    return Array.from({ length: lines }).map(() => width as string);
  });
}
