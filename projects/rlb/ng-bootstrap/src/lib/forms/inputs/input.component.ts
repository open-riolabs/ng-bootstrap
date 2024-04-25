import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Optional,
  Self,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';

@Component({
  selector: 'rlb-input',
  template: `
  <ng-template #template>
    <ng-content select="[before]"></ng-content>
      <input
        #field
        [id]="id"
        class="form-control"
        [type]="type"
        [name]="name"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [attr.placeholder]="placeholder"
        [class.form-control-lg]="size === 'large'"
        [class.form-control-sm]="size === 'small'"
        [value]="value || ''"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      />
      <rlb-input-validation *ngIf="!extValidation" [errors]="errors"/>
    <ng-content select="[after]"></ng-content>
  </ng-template>`,
})
export class InputComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor {
  @Input({ alias: 'disabled', transform: booleanAttribute, }) disabled?: boolean;
  @Input({ alias: 'readonly', transform: booleanAttribute, }) readonly?: boolean;
  @Input({ alias: 'before-text', transform: booleanAttribute, }) beforeText?: boolean;
  @Input({ alias: 'placeholder' }) placeholder?: string;
  @Input({ alias: 'type' }) type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | string = 'text';
  @Input({ alias: 'size' }) size?: 'small' | 'large';
  @Input({ alias: 'name' }) name?: string;

  public extValidation: boolean = false;

  @ViewChild('field') el!: ElementRef<HTMLInputElement>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (!this.disabled) {
      const t = ev as HTMLInputElement;
      this.setValue(t?.value || '');
    }
  }

  override onWrite(data: string): void {
    if (this.el && this.el.nativeElement) {
      this.el.nativeElement.value = data || '';
    }
  }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    //this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();

  }
}
