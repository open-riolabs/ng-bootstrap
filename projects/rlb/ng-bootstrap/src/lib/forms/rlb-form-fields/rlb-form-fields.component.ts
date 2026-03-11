import {
  booleanAttribute,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { FormField, FormFieldsDefinition, IForm } from './form-fields';

@Component({
  selector: 'rlb-form-fields',
  templateUrl: './rlb-form-fields.component.html',
  styleUrls: ['./rlb-form-fields.component.scss'],
  standalone: false
})
export class FormFieldsComponent implements IForm {
  public filterForm = signal<FormGroup | undefined>(undefined);

  title = input<string>('', { alias: 'title' });
  subTitle = input<string>('', { alias: 'sub-title' });
  noSubmit = input(false, { alias: 'no-submit', transform: booleanAttribute });
  noCard = input(false, { alias: 'no-card', transform: booleanAttribute });
  fields = input<FormFieldsDefinition | undefined>(undefined, { alias: 'fields' });

  submit = output<any>();

  form = viewChild<NgForm>('ngForm');

  _fields = computed(() => {
    const fieldsData = this.fields();
    if (!fieldsData) return [];
    return Object.keys(fieldsData).map((o) => {
      return { property: o, ...(fieldsData as any)[o] } as FormField;
    });
  });

  constructor() {
    effect(() => {
      this.buildForm(this.fields());
    });
  }

  private buildForm(fieldsData: FormFieldsDefinition | undefined) {
    if (!fieldsData) {
      this.filterForm.set(undefined);
      return;
    }
    const formGroup = {} as { [k: string]: FormControl; };
    for (const field of this._fields()) {
      formGroup[field.property] = new FormControl(
        field.property,
        field.validators,
      );
    }
    this.filterForm.set(new FormGroup(formGroup));
  }

  onFilterSubmit() {
    const form = this.filterForm();
    if (form && form.valid) {
      this.submit.emit(form.value);
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
    this.form()?.onSubmit({} as Event);
  }
}
