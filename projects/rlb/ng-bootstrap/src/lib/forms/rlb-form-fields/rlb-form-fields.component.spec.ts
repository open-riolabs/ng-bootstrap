import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldsComponent } from './rlb-form-fields.component';

describe('FieldsFormComponent', () => {
  let component: FormFieldsComponent;
  let fixture: ComponentFixture<FormFieldsComponent>;

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
});
