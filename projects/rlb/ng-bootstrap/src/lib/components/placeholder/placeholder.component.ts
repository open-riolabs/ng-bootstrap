import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
    selector: 'rlb-placeholder',
    template: `
    <div [class]="containerClass()">
      <ng-content />
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RlbPlaceholderComponent {
  animation = input<'glow' | 'wave' | 'none'>('none');

  containerClass = computed(() => {
    if (this.animation() === 'none') return [];
    return `placeholder-${this.animation()}`;
  });
}
