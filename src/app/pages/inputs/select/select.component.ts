import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, delay, EMPTY, map, Observable, of, tap } from 'rxjs';
import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  imports: [SHARED_IMPORTS],
})
export class SelectsComponent implements OnInit {
  // Test Properties (ngModel + Async load)
  result: { nextIntentId?: string } = { nextIntentId: 'intent_2' };
  intents: any[] = [];
  intentLoading = false;


  private fb = inject(FormBuilder);

  // Forms
  basicForm: FormGroup;
  form: FormGroup;

  // State Management via Signals
  isSaving = signal(false);
  isLoadingOptions = signal(true);
  asyncOptions = signal<{ id: string; name: string }[]>([]);

  html: string = `<rlb-select></rlb-select>`;

  constructor() {
    this.basicForm = this.fb.group({
      select: ['', Validators.required],
    });

    this.form = this.fb.group({
      basicSelect: ['', Validators.required],
      multiSelect: [[], Validators.required],
      asyncSelect: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Simulate fetching options from an API for the Async Select
    setTimeout(() => {
      this.asyncOptions.set([
        { id: 'u1', name: 'Alice Smith' },
        { id: 'u2', name: 'Bob Johnson' },
        { id: 'u3', name: 'Charlie Brown' },
      ]);
      this.isLoadingOptions.set(false);
    }, 1500);

    this.loadIntents();
  }

  private loadIntents(): void {
    this.intentLoading = true;

    this.mockIntentService()
      .pipe(
        map(intents => intents.filter(intent => intent.enabled)),
        tap(intents => (this.intents = intents)),
        tap(() => {
          this.intentLoading = false;
        }),
        catchError(() => {
          this.intentLoading = false;
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private mockIntentService(): Observable<any[]> {
    return of([
      { _id: 'intent_1', name: 'Greeting Intent', enabled: true },
      { _id: 'intent_2', name: 'Support Intent', enabled: true },
      { _id: 'intent_3', name: 'Deprecated Intent', enabled: false },
      { _id: 'intent_4', name: 'Closing Intent', enabled: true },
    ]).pipe(delay(1500));
  }

  patchData(): void {
    this.form.patchValue({
      basicSelect: 'vue',
      multiSelect: ['ts', 'signals'],
      asyncSelect: 'u2',
    });
  }

  submitForm(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.isSaving.set(true);
      this.form.disable();

      // Simulate API Call
      setTimeout(() => {
        this.isSaving.set(false);
        this.form.enable();

        alert('Form saved successfully! \n\n' + JSON.stringify(this.form.value, null, 2));

        this.form.reset();
      }, 2000);
    }
  }
}
