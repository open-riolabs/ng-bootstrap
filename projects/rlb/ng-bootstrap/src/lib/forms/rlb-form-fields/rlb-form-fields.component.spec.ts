import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldsDefinition } from './form-fields';
import { FormFieldsComponent } from './rlb-form-fields.component';

/**
 * What a form built from a field definition starts on.
 *
 * Every control used to be created as `new FormControl(field.property, …)`, which seeded it with
 * its own key: a definition of `{ email: … }` opened with the word `email` already typed into the
 * email box, and — because most of these fields are required — the form opened valid on data the
 * user had never entered.
 */
describe('FormFieldsComponent', () => {
  let component: FormFieldsComponent;
  let fixture: ComponentFixture<FormFieldsComponent>;

  const fields: FormFieldsDefinition = {
    email: { name: 'email', type: 'email' },
    active: { name: 'active', type: 'switch' },
    city: { name: 'city', type: 'text', value: 'Milano' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormFieldsComponent],
    });
    fixture = TestBed.createComponent(FormFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts a text field empty rather than on its own property name', async () => {
    fixture.componentRef.setInput('fields', fields);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.filterForm()!.get('email')!.value).toBeNull();
  });

  it('starts a switch off rather than null', async () => {
    fixture.componentRef.setInput('fields', fields);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.filterForm()!.get('active')!.value).toBe(false);
  });

  it('honours the value a field asks to start on', async () => {
    fixture.componentRef.setInput('fields', fields);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.filterForm()!.get('city')!.value).toBe('Milano');
  });
});
