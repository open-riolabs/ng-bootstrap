import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  Renderer2,
  Self,
  ViewChild,
  booleanAttribute,
  numberAttribute
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';
import { AutocompleteItem } from './autocomplete.component';

@Component({
  selector: 'rlb-autocomplete-country',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        [id]="id"
        class="form-control"
        type="text"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [attr.placeholder]="placeholder"
        [class.form-control-lg]="size === 'large'"
        [class.form-control-sm]="size === 'small'"
        [value]="getText(value)"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
        (keyup.enter)="onEnter($event.target)"
      />
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
    </div>
    <rlb-progress class="w-100" [height]="2" [infinite]="loading || acLoading" color="primary" />
    <ng-content select="[after]"></ng-content>
    <div
      #autocomplete
      [id]="id+'-ac'"
      class="dropdown-menu overflow-y-auto w-100 position-relative"
      aria-labelledby="dropdownMenu"
      [style.max-height.px]="maxHeight">
    </div>
   `,
  standalone: false
})
export class AutocompleteCountryComponent
  extends AbstractComponent<string | undefined>
  implements ControlValueAccessor {
  acLoading: boolean = false;
  private typingTimeout: any;

  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled? = false;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly? = false;
  @Input({ transform: booleanAttribute, alias: 'before-text' }) beforeText?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'loading' }) loading?: boolean = false;
  @Input({ transform: numberAttribute, alias: 'max-height' }) maxHeight?: number = 200;
  @Input({ alias: 'placeholder' }) placeholder?: string = '';
  @Input() size?: 'small' | 'large' | undefined;
  @Input({ alias: 'id', transform: (v: string) => v || '' }) userDefinedId: string = '';

  @ViewChild('field') el!: ElementRef<HTMLInputElement>;
  @ViewChild('autocomplete') dropdown!: ElementRef<HTMLElement>;
  @Output() selected: EventEmitter<AutocompleteItem> = new EventEmitter<AutocompleteItem>();

  constructor(
    idService: UniqueIdService,
    private readonly renderer: Renderer2,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    this.setValue(undefined);
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = setTimeout(() => {
      if (!this.disabled) {
        const t = ev as HTMLInputElement;
        this.manageSuggestions(t?.value);
      }
    }, 500);
    if (!this.disabled) {
      const t = ev as HTMLInputElement;
      this.manageSuggestions(t?.value);
    }
  }

  override onWrite(data?: AutocompleteItem): void {
    if (this.el && this.el.nativeElement) {
      if (typeof data === 'string') {
        this.el.nativeElement.value = data;
      } else {
        this.el.nativeElement.value = data?.text || '';
      }
    }
  }

  manageSuggestions(data: string) {
    this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'block');
    while (this.dropdown.nativeElement.firstChild) {
      if (this.dropdown.nativeElement.lastChild) {
        this.dropdown.nativeElement.removeChild(this.dropdown.nativeElement.lastChild);
      }
    }
    if (data && data.length > 0) {
      const suggestions = this.countries.filter(o => {
        const _c = o as { text: string, value: string; };
        return _c.text.toLowerCase().startsWith(data.toLowerCase());
      });
      this.renderAc(suggestions);
    } else {
      this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'none');
    }
  }

  renderAc(suggestions: AutocompleteItem[]) {
    if (suggestions.length > 0) {
      for (const suggestion of suggestions) {
        const el = this.renderer.createElement('a');
        this.renderer.addClass(el, 'dropdown-item');
        this.renderer.appendChild(el, this.renderer.createText(typeof suggestion === 'string' ? suggestion : suggestion.text));
        this.renderer.listen(el, 'click', () => {
          this.selected.emit(typeof suggestion === 'string' ? suggestion : suggestion.value);
          this.setValue(typeof suggestion === 'string' ? suggestion : suggestion.value);
          this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'none');
        });
        this.renderer.appendChild(this.dropdown.nativeElement, el);
      }
    } else {
      const el = this.renderer.createElement('a');
      this.renderer.addClass(el, 'dropdown-item');
      this.renderer.addClass(el, 'disabled');
      this.renderer.addClass(el, 'text-center');
      this.renderer.setAttribute(el, 'disabled', 'true');
      this.renderer.appendChild(el, this.renderer.createText('No suggestions'));
      this.renderer.appendChild(this.dropdown.nativeElement, el);
    }
  }

  onEnter(ev: EventTarget | null) {
    const t = ev as HTMLInputElement;
    if (!this.disabled && t && t.value) {
      this.setValue(t?.value);
      this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'none');
    }
  }

  getText(d?: AutocompleteItem) {
    const h = this.countries.find(c => {
      if (typeof c === 'object') {
        const _c = c as { text: string, value: string; };
        return _c.value === (typeof d === 'object' ? d?.value : d) ? _c.text : '';
      }
      return false;
    });
    return (typeof h === 'object' ? h.text : '') || '';
  }

  private countries: AutocompleteItem[] = [
    { "text": "Afghanistan", "value": "AF" },
    { "text": "Albania", "value": "AL" },
    { "text": "Algeria", "value": "DZ" },
    { "text": "Andorra", "value": "AD" },
    { "text": "Angola", "value": "AO" },
    { "text": "Antigua and Barbuda", "value": "AG" },
    { "text": "Argentina", "value": "AR" },
    { "text": "Armenia", "value": "AM" },
    { "text": "Aruba", "value": "AW" },
    { "text": "Australia", "value": "AU" },
    { "text": "Austria", "value": "AT" },
    { "text": "Azerbaijan", "value": "AZ" },
    { "text": "Bahamas", "value": "BS" },
    { "text": "Bahrain", "value": "BH" },
    { "text": "Bangladesh", "value": "BD" },
    { "text": "Barbados", "value": "BB" },
    { "text": "Belarus", "value": "BY" },
    { "text": "Belgium", "value": "BE" },
    { "text": "Belize", "value": "BZ" },
    { "text": "Benin", "value": "BJ" },
    { "text": "Bhutan", "value": "BT" },
    { "text": "Bolivia", "value": "BO" },
    { "text": "Bosnia and Herzegovina", "value": "BA" },
    { "text": "Botswana", "value": "BW" },
    { "text": "Brazil", "value": "BR" },
    { "text": "Brunei", "value": "BN" },
    { "text": "Bulgaria", "value": "BG" },
    { "text": "Burkina Faso", "value": "BF" },
    { "text": "Burundi", "value": "BI" },
    { "text": "Cabo Verde", "value": "CV" },
    { "text": "Cambodia", "value": "KH" },
    { "text": "Cameroon", "value": "CM" },
    { "text": "Canada", "value": "CA" },
    { "text": "Central African Republic", "value": "CF" },
    { "text": "Chad", "value": "TD" },
    { "text": "Chile", "value": "CL" },
    { "text": "China", "value": "CN" },
    { "text": "Colombia", "value": "CO" },
    { "text": "Comoros", "value": "KM" },
    { "text": "Congo (Congo-Brazzaville)", "value": "CG" },
    { "text": "Costa Rica", "value": "CR" },
    { "text": "Croatia", "value": "HR" },
    { "text": "Cuba", "value": "CU" },
    { "text": "Cyprus", "value": "CY" },
    { "text": "Czechia (Czech Republic)", "value": "CZ" },
    { "text": "Republic of Congo", "value": "CD" },
    { "text": "Denmark", "value": "DK" },
    { "text": "Djibouti", "value": "DJ" },
    { "text": "Dominica", "value": "DM" },
    { "text": "Dominican Republic", "value": "DO" },
    { "text": "Ecuador", "value": "EC" },
    { "text": "Egypt", "value": "EG" },
    { "text": "El Salvador", "value": "SV" },
    { "text": "Equatorial Guinea", "value": "GQ" },
    { "text": "Eritrea", "value": "ER" },
    { "text": "Estonia", "value": "EE" },
    { "text": "Eswatini (\"Swaziland\")", "value": "SZ" },
    { "text": "Ethiopia", "value": "ET" },
    { "text": "Fiji", "value": "FJ" },
    { "text": "Finland", "value": "FI" },
    { "text": "France", "value": "FR" },
    { "text": "Gabon", "value": "GA" },
    { "text": "Gambia", "value": "GM" },
    { "text": "Georgia", "value": "GE" },
    { "text": "Germany", "value": "DE" },
    { "text": "Ghana", "value": "GH" },
    { "text": "Greece", "value": "GR" },
    { "text": "Grenada", "value": "GD" },
    { "text": "Guatemala", "value": "GT" },
    { "text": "Guinea", "value": "GN" },
    { "text": "Guinea-Bissau", "value": "GW" },
    { "text": "Guyana", "value": "GY" },
    { "text": "Haiti", "value": "HT" },
    { "text": "Holy See", "value": "VA" },
    { "text": "Honduras", "value": "HN" },
    { "text": "Hong Kong", "value": "HK" },
    { "text": "Hungary", "value": "HU" },
    { "text": "Iceland", "value": "IS" },
    { "text": "India", "value": "IN" },
    { "text": "Indonesia", "value": "ID" },
    { "text": "Iran", "value": "IR" },
    { "text": "Iraq", "value": "IQ" },
    { "text": "Ireland", "value": "IE" },
    { "text": "Israel", "value": "IL" },
    { "text": "Italy", "value": "IT" },
    { "text": "Jamaica", "value": "JM" },
    { "text": "Japan", "value": "JP" },
    { "text": "Jordan", "value": "JO" },
    { "text": "Kazakhstan", "value": "KZ" },
    { "text": "Kenya", "value": "KE" },
    { "text": "Kiribati", "value": "KI" },
    { "text": "Kuwait", "value": "KW" },
    { "text": "Kyrgyzstan", "value": "KG" },
    { "text": "Laos", "value": "LA" },
    { "text": "Latvia", "value": "LV" },
    { "text": "Lebanon", "value": "LB" },
    { "text": "Lesotho", "value": "LS" },
    { "text": "Liberia", "value": "LR" },
    { "text": "Libya", "value": "LY" },
    { "text": "Liechtenstein", "value": "LI" },
    { "text": "Lithuania", "value": "LT" },
    { "text": "Luxembourg", "value": "LU" },
    { "text": "Madagascar", "value": "MG" },
    { "text": "Malawi", "value": "MW" },
    { "text": "Malaysia", "value": "MY" },
    { "text": "Maldives", "value": "MV" },
    { "text": "Mali", "value": "ML" },
    { "text": "Malta", "value": "MT" },
    { "text": "Marshall Islands", "value": "MH" },
    { "text": "Mauritania", "value": "MR" },
    { "text": "Mauritius", "value": "MU" },
    { "text": "Mexico", "value": "MX" },
    { "text": "Micronesia", "value": "FM" },
    { "text": "Moldova", "value": "MD" },
    { "text": "Monaco", "value": "MC" },
    { "text": "Mongolia", "value": "MN" },
    { "text": "Montenegro", "value": "ME" },
    { "text": "Morocco", "value": "MA" },
    { "text": "Mozambique", "value": "MZ" },
    { "text": "Myanmar (Burma)", "value": "MM" },
    { "text": "Namibia", "value": "NA" },
    { "text": "Nauru", "value": "NR" },
    { "text": "Nepal", "value": "NP" },
    { "text": "Netherlands", "value": "NL" },
    { "text": "New Zealand", "value": "NZ" },
    { "text": "Nicaragua", "value": "NI" },
    { "text": "Niger", "value": "NE" },
    { "text": "Nigeria", "value": "NG" },
    { "text": "North Korea", "value": "KP" },
    { "text": "North Macedonia", "value": "MK" },
    { "text": "Norway", "value": "NO" },
    { "text": "Oman", "value": "OM" },
    { "text": "Pakistan", "value": "PK" },
    { "text": "Palau", "value": "PW" },
    { "text": "Palestine State", "value": "PS" },
    { "text": "Panama", "value": "PA" },
    { "text": "Papua New Guinea", "value": "PG" },
    { "text": "Paraguay", "value": "PY" },
    { "text": "Peru", "value": "PE" },
    { "text": "Philippines", "value": "PH" },
    { "text": "Poland", "value": "PL" },
    { "text": "Puerto Rico", "value": "PR" },
    { "text": "Portugal", "value": "PT" },
    { "text": "Qatar", "value": "QA" },
    { "text": "Romania", "value": "RO" },
    { "text": "Russia", "value": "RU" },
    { "text": "Rwanda", "value": "RW" },
    { "text": "St. Kitts and Nevis", "value": "KN" },
    { "text": "St. Lucia", "value": "LC" },
    { "text": "St. Vincent and Grenadines", "value": "VC" },
    { "text": "Samoa", "value": "WS" },
    { "text": "San Marino", "value": "SM" },
    { "text": "Sao Tome and Principe", "value": "ST" },
    { "text": "Saudi Arabia", "value": "SA" },
    { "text": "Senegal", "value": "SN" },
    { "text": "Serbia", "value": "RS" },
    { "text": "Seychelles", "value": "SC" },
    { "text": "Sierra Leone", "value": "SL" },
    { "text": "Singapore", "value": "SG" },
    { "text": "Slovakia", "value": "SK" },
    { "text": "Slovenia", "value": "SI" },
    { "text": "Solomon Islands", "value": "SB" },
    { "text": "Somalia", "value": "SO" },
    { "text": "South Africa", "value": "ZA" },
    { "text": "South Korea", "value": "KR" },
    { "text": "South Sudan", "value": "SS" },
    { "text": "Spain", "value": "ES" },
    { "text": "Sri Lanka", "value": "LK" },
    { "text": "Sudan", "value": "SD" },
    { "text": "Suriname", "value": "SR" },
    { "text": "Sweden", "value": "SE" },
    { "text": "Switzerland", "value": "CH" },
    { "text": "Syria", "value": "SY" },
    { "text": "Taiwan ", "value": "TW" },
    { "text": "Tajikistan", "value": "TJ" },
    { "text": "Tanzania", "value": "TZ" },
    { "text": "Thailand", "value": "TH" },
    { "text": "Timor-Leste", "value": "TL" },
    { "text": "Togo", "value": "TG" },
    { "text": "Tonga", "value": "TO" },
    { "text": "Trinidad and Tobago", "value": "TT" },
    { "text": "Tunisia", "value": "TN" },
    { "text": "Turkey", "value": "TR" },
    { "text": "Turkmenistan", "value": "TM" },
    { "text": "Tuvalu", "value": "TV" },
    { "text": "Uganda", "value": "UG" },
    { "text": "Ukraine", "value": "UA" },
    { "text": "United Arab Emirates", "value": "AE" },
    { "text": "United Kingdom", "value": "GB" },
    { "text": "United States of America", "value": "US" },
    { "text": "Uruguay", "value": "UY" },
    { "text": "Uzbekistan", "value": "UZ" },
    { "text": "Vanuatu", "value": "VU" },
    { "text": "Venezuela", "value": "VE" },
    { "text": "Vietnam", "value": "VN" },
    { "text": "Yemen", "value": "YE" },
    { "text": "Zambia", "value": "ZM" },
    { "text": "Zimbabwe", "value": "ZW" }
  ];

}
