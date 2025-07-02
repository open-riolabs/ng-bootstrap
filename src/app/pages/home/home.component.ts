import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { ModalService, ToastService } from 'projects/rlb/ng-bootstrap/src/public-api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent {
  constructor(
    private modals: ModalService,
    private toasts: ToastService,
  ) { }

  number: number = 0;
  dtz?: IDateTz = DateTz.now();
  str: string = 'Hello World!';
  timezone: string = '';
  country: string = '';

  profileForm = new FormGroup({
    firstName: new FormControl<string>("dd", [Validators.required, Validators.minLength(2)]),

  });

  updateProfile() { }
}

