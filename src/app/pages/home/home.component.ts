import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import {
  AutocompleteItem,
  ModalService,
  requiredAutocompleteValue,
  ToastService,
} from 'projects/rlb/ng-bootstrap/src/public-api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent {
  number: number = 0;
  dtz: IDateTz = DateTz.now();
  str: string = 'Hello World!';
  timezone: string = '';
  country: string = '';
  carouselPage: number = 0;
  carouselCount: number = 0;
  countryDialCode = '';

  profileForm = new FormGroup({
    firstName: new FormControl<string>('dd', [
      Validators.required,
      Validators.minLength(2),
    ]),
    country: new FormControl<AutocompleteItem>({ text: '', value: '' }, [
      requiredAutocompleteValue(),
    ]),
    profile: new FormGroup({
      culture: new FormGroup({
        timezone: new FormControl<string>('', [requiredAutocompleteValue()]),
      }),
    }),
    dialCode: new FormControl<AutocompleteItem>({ text: '', value: '' }, [
      requiredAutocompleteValue(),
    ]),
  });

  constructor(
    private modals: ModalService,
    private toasts: ToastService,
  ) {
    this.profileForm.valueChanges.subscribe((value) => {
      console.log('Form value: ', value);
    });
    this.profileForm.patchValue({
      profile: {
        culture: {
          timezone: 'Europe/Rome',
        },
      },
    });
  }

  updateProfile() {}

  test() {
    console.log('Form value: ', this.profileForm.value);
  }

  testPatch() {
    this.profileForm.patchValue({
      profile: {
        culture: {
          timezone: 'Europe/Paris' as any,
        },
      },
    });
  }
}
