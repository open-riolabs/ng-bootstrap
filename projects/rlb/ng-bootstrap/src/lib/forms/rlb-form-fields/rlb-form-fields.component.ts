import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  booleanAttribute,
} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FormFieldsDefinition, FormField, IForm } from './form-fields';

@Component({
    selector: 'rlb-form-fields',
    templateUrl: './rlb-form-fields.component.html',
    styleUrls: ['./rlb-form-fields.component.scss'],
    standalone: false
})
export class FormFieldsComponent implements IForm, OnChanges {
  public filterForm!: FormGroup;

  @Input({ alias: 'title' }) public title!: string;
  @Input({ alias: 'sub-title' }) public subTitle!: string;
  @Input({ alias: 'no-submit', transform: booleanAttribute }) public noSubmit?: boolean;
  @Input({ alias: 'no-card', transform: booleanAttribute }) public noCard?: boolean;
  @Input({ alias: 'fields' }) public fields?: FormFieldsDefinition;

  @Output() public submit: EventEmitter<any> = new EventEmitter();

  @ViewChild('ngForm') form!: NgForm;

  get _fields() {
    if (!this.fields) return [];
    return Object.keys(this.fields).map((o) => {
      return { property: o, ...this.fields?.[o] } as FormField;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['fields'].previousValue !== changes['fields'].currentValue ||
      changes['fields'].isFirstChange()
    ) {
      this.buildForm();
    }
  }

  private buildForm() {
    if (!this.fields) return;
    const formGroup = {} as { [k: string]: FormControl };
    for (const field of this._fields) {
      formGroup[field.property] = new FormControl(
        field.property,
        field.validators,
      );
    }
    this.filterForm = new FormGroup(formGroup);
  }

  onFilterSubmit() {
    if (this.filterForm.valid) {
      this.submit.emit(this.filterForm.value);
    }
  }

  identify(index: number, el: FormField): string {
    return el.property;
  }

  isText(t: string) {
    return [
      'text',
      'email',
      'number',
      'password',
      'search',
      'tel',
      'url',
      'string',
    ].includes(t);
  }

  isSwitch(t: string) {
    return ['switch'].includes(t);
  }

  submitForm() {
    this.form.onSubmit({} as Event);
  }
}
