import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '../buttons/buttons.component';
import { ToggleDirective } from '../buttons/toggle.directive';

@Component({
    selector: 'rlb-accordion-header',
    template: `
    <button class="accordion-button" rlb-button toggle="collapse" [toggle-target]="itemId() || ''" [collapsed]="!expanded()">
      <ng-content></ng-content>
    </button>`,
    host: { class: 'accordion-header' },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, ToggleDirective],
})
export class AccordionHeaderComponent {
  public parentId = signal<string | undefined>(undefined);
  public itemId = signal<string | undefined>(undefined);
  public expanded = signal(false);
}
