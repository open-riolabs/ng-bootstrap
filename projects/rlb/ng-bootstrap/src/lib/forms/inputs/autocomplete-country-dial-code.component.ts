import { booleanAttribute, Component, Input, Optional, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractAutocompleteComponent } from "./abstract-autocomplete.component";
import { AutocompleteItem } from "./autocomplete-model";

@Component({
	selector: 'rlb-autocomplete-country-dial-code',
	template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation position-relative">
      <input
        #field
        [id]="id"
        class="form-control"
        type="text"
        [attr.autocomplete]="'off'"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [attr.placeholder]="placeholder"
        [class.form-control-lg]="size === 'large'"
        [class.form-control-sm]="size === 'small'"
        (blur)="touch()"
				[ngClass]="{
        'is-invalid': control?.touched && control?.invalid,
        'is-valid': control?.touched && control?.valid
        }"
        (input)="update($event.target)"
        />
        @if (errors && showError) {
          <rlb-input-validation [errors]="errors"/>
        }
        <div
          #autocomplete
          [id]="id+'-ac'"
          class="dropdown-menu overflow-y-auto w-100 position-absolute"
          aria-labelledby="dropdownMenu"
          [style.max-height.px]="maxHeight"
          style="z-index: 1000; top: 100%;">
        </div>
      </div>
    `,
	standalone: false
})
export class AutocompleteCountryDialCodeComponent
	extends AbstractAutocompleteComponent
	implements ControlValueAccessor {

	@Input({ transform: booleanAttribute, alias: 'enable-flag-icons' }) enableFlagIcons?: boolean = true;

	constructor(
		idService: UniqueIdService,
		renderer: Renderer2,
		@Self() @Optional() override control?: NgControl,
	) {
		super(idService, renderer, control);
	}

	protected override getSuggestions(query: string) {
		this.clearDropdown();
		this.activeIndex = -1;

		if (query && query.length > 0) {
			this.openDropdown();
			const suggestions = this.getCountries().filter(o => {
				const _c = o as { text: string, value: string; };
				return _c.text.toLowerCase().startsWith(query.toLowerCase());
			});
			this.renderAc(suggestions);
		} else {
			this.closeDropdown();
		}
	}

	protected override getItemText(data?: AutocompleteItem | string): string {
		const valueToFind = typeof data === 'object' ? data?.value : data;
		const h = this.getCountries().find(c => {
			if (typeof c === 'object') {
				const _c = c as { text: string, value: string; };
				return _c.value === valueToFind;
			}
			return false;
		});
		return (typeof h === 'object' ? h.text : (typeof data === 'string' ? data : ''));
	}

	getCountries(): AutocompleteItem[] {
		if (this.enableFlagIcons) {
			return this._countries.map((country) => {
				return {
					...country,
					iconClass: `fi fi-${country.data.toLowerCase()}`,
				};
			});
		} else {
			return this._countries;
		}
	}

	private _countries: AutocompleteItem[] = [
		{
			"text": "Afghanistan",
			"value": "+93",
			"data": "AF"
		},
		{
			"text": "Aland Islands",
			"value": "+358",
			"data": "AX"
		},
		{
			"text": "Albania",
			"value": "+355",
			"data": "AL"
		},
		{
			"text": "Algeria",
			"value": "+213",
			"data": "DZ"
		},
		{
			"text": "AmericanSamoa",
			"value": "+1684",
			"data": "AS"
		},
		{
			"text": "Andorra",
			"value": "+376",
			"data": "AD"
		},
		{
			"text": "Angola",
			"value": "+244",
			"data": "AO"
		},
		{
			"text": "Anguilla",
			"value": "+1264",
			"data": "AI"
		},
		{
			"text": "Antarctica",
			"value": "+672",
			"data": "AQ"
		},
		{
			"text": "Antigua and Barbuda",
			"value": "+1268",
			"data": "AG"
		},
		{
			"text": "Argentina",
			"value": "+54",
			"data": "AR"
		},
		{
			"text": "Armenia",
			"value": "+374",
			"data": "AM"
		},
		{
			"text": "Aruba",
			"value": "+297",
			"data": "AW"
		},
		{
			"text": "Australia",
			"value": "+61",
			"data": "AU"
		},
		{
			"text": "Austria",
			"value": "+43",
			"data": "AT"
		},
		{
			"text": "Azerbaijan",
			"value": "+994",
			"data": "AZ"
		},
		{
			"text": "Bahamas",
			"value": "+1242",
			"data": "BS"
		},
		{
			"text": "Bahrain",
			"value": "+973",
			"data": "BH"
		},
		{
			"text": "Bangladesh",
			"value": "+880",
			"data": "BD"
		},
		{
			"text": "Barbados",
			"value": "+1246",
			"data": "BB"
		},
		{
			"text": "Belarus",
			"value": "+375",
			"data": "BY"
		},
		{
			"text": "Belgium",
			"value": "+32",
			"data": "BE"
		},
		{
			"text": "Belize",
			"value": "+501",
			"data": "BZ"
		},
		{
			"text": "Benin",
			"value": "+229",
			"data": "BJ"
		},
		{
			"text": "Bermuda",
			"value": "+1441",
			"data": "BM"
		},
		{
			"text": "Bhutan",
			"value": "+975",
			"data": "BT"
		},
		{
			"text": "Bolivia, Plurinational State of",
			"value": "+591",
			"data": "BO"
		},
		{
			"text": "Bosnia and Herzegovina",
			"value": "+387",
			"data": "BA"
		},
		{
			"text": "Botswana",
			"value": "+267",
			"data": "BW"
		},
		{
			"text": "Brazil",
			"value": "+55",
			"data": "BR"
		},
		{
			"text": "British Indian Ocean Territory",
			"value": "+246",
			"data": "IO"
		},
		{
			"text": "Brunei Darussalam",
			"value": "+673",
			"data": "BN"
		},
		{
			"text": "Bulgaria",
			"value": "+359",
			"data": "BG"
		},
		{
			"text": "Burkina Faso",
			"value": "+226",
			"data": "BF"
		},
		{
			"text": "Burundi",
			"value": "+257",
			"data": "BI"
		},
		{
			"text": "Cambodia",
			"value": "+855",
			"data": "KH"
		},
		{
			"text": "Cameroon",
			"value": "+237",
			"data": "CM"
		},
		{
			"text": "Canada",
			"value": "+1",
			"data": "CA"
		},
		{
			"text": "Cape Verde",
			"value": "+238",
			"data": "CV"
		},
		{
			"text": "Cayman Islands",
			"value": "+ 345",
			"data": "KY"
		},
		{
			"text": "Central African Republic",
			"value": "+236",
			"data": "CF"
		},
		{
			"text": "Chad",
			"value": "+235",
			"data": "TD"
		},
		{
			"text": "Chile",
			"value": "+56",
			"data": "CL"
		},
		{
			"text": "China",
			"value": "+86",
			"data": "CN"
		},
		{
			"text": "Christmas Island",
			"value": "+61",
			"data": "CX"
		},
		{
			"text": "Cocos (Keeling) Islands",
			"value": "+61",
			"data": "CC"
		},
		{
			"text": "Colombia",
			"value": "+57",
			"data": "CO"
		},
		{
			"text": "Comoros",
			"value": "+269",
			"data": "KM"
		},
		{
			"text": "Congo",
			"value": "+242",
			"data": "CG"
		},
		{
			"text": "Congo, The Democratic Republic of the Congo",
			"value": "+243",
			"data": "CD"
		},
		{
			"text": "Cook Islands",
			"value": "+682",
			"data": "CK"
		},
		{
			"text": "Costa Rica",
			"value": "+506",
			"data": "CR"
		},
		{
			"text": "Cote d'Ivoire",
			"value": "+225",
			"data": "CI"
		},
		{
			"text": "Croatia",
			"value": "+385",
			"data": "HR"
		},
		{
			"text": "Cuba",
			"value": "+53",
			"data": "CU"
		},
		{
			"text": "Cyprus",
			"value": "+357",
			"data": "CY"
		},
		{
			"text": "Czech Republic",
			"value": "+420",
			"data": "CZ"
		},
		{
			"text": "Denmark",
			"value": "+45",
			"data": "DK"
		},
		{
			"text": "Djibouti",
			"value": "+253",
			"data": "DJ"
		},
		{
			"text": "Dominica",
			"value": "+1767",
			"data": "DM"
		},
		{
			"text": "Dominican Republic",
			"value": "+1849",
			"data": "DO"
		},
		{
			"text": "Ecuador",
			"value": "+593",
			"data": "EC"
		},
		{
			"text": "Egypt",
			"value": "+20",
			"data": "EG"
		},
		{
			"text": "El Salvador",
			"value": "+503",
			"data": "SV"
		},
		{
			"text": "Equatorial Guinea",
			"value": "+240",
			"data": "GQ"
		},
		{
			"text": "Eritrea",
			"value": "+291",
			"data": "ER"
		},
		{
			"text": "Estonia",
			"value": "+372",
			"data": "EE"
		},
		{
			"text": "Ethiopia",
			"value": "+251",
			"data": "ET"
		},
		{
			"text": "Falkland Islands (Malvinas)",
			"value": "+500",
			"data": "FK"
		},
		{
			"text": "Faroe Islands",
			"value": "+298",
			"data": "FO"
		},
		{
			"text": "Fiji",
			"value": "+679",
			"data": "FJ"
		},
		{
			"text": "Finland",
			"value": "+358",
			"data": "FI"
		},
		{
			"text": "France",
			"value": "+33",
			"data": "FR"
		},
		{
			"text": "French Guiana",
			"value": "+594",
			"data": "GF"
		},
		{
			"text": "French Polynesia",
			"value": "+689",
			"data": "PF"
		},
		{
			"text": "Gabon",
			"value": "+241",
			"data": "GA"
		},
		{
			"text": "Gambia",
			"value": "+220",
			"data": "GM"
		},
		{
			"text": "Georgia",
			"value": "+995",
			"data": "GE"
		},
		{
			"text": "Germany",
			"value": "+49",
			"data": "DE"
		},
		{
			"text": "Ghana",
			"value": "+233",
			"data": "GH"
		},
		{
			"text": "Gibraltar",
			"value": "+350",
			"data": "GI"
		},
		{
			"text": "Greece",
			"value": "+30",
			"data": "GR"
		},
		{
			"text": "Greenland",
			"value": "+299",
			"data": "GL"
		},
		{
			"text": "Grenada",
			"value": "+1473",
			"data": "GD"
		},
		{
			"text": "Guadeloupe",
			"value": "+590",
			"data": "GP"
		},
		{
			"text": "Guam",
			"value": "+1671",
			"data": "GU"
		},
		{
			"text": "Guatemala",
			"value": "+502",
			"data": "GT"
		},
		{
			"text": "Guernsey",
			"value": "+44",
			"data": "GG"
		},
		{
			"text": "Guinea",
			"value": "+224",
			"data": "GN"
		},
		{
			"text": "Guinea-Bissau",
			"value": "+245",
			"data": "GW"
		},
		{
			"text": "Guyana",
			"value": "+595",
			"data": "GY"
		},
		{
			"text": "Haiti",
			"value": "+509",
			"data": "HT"
		},
		{
			"text": "Holy See (Vatican City State)",
			"value": "+379",
			"data": "VA"
		},
		{
			"text": "Honduras",
			"value": "+504",
			"data": "HN"
		},
		{
			"text": "Hong Kong",
			"value": "+852",
			"data": "HK"
		},
		{
			"text": "Hungary",
			"value": "+36",
			"data": "HU"
		},
		{
			"text": "Iceland",
			"value": "+354",
			"data": "IS"
		},
		{
			"text": "India",
			"value": "+91",
			"data": "IN"
		},
		{
			"text": "Indonesia",
			"value": "+62",
			"data": "ID"
		},
		{
			"text": "Iran, Islamic Republic of Persian Gulf",
			"value": "+98",
			"data": "IR"
		},
		{
			"text": "Iraq",
			"value": "+964",
			"data": "IQ"
		},
		{
			"text": "Ireland",
			"value": "+353",
			"data": "IE"
		},
		{
			"text": "Isle of Man",
			"value": "+44",
			"data": "IM"
		},
		{
			"text": "Israel",
			"value": "+972",
			"data": "IL"
		},
		{
			"text": "Italy",
			"value": "+39",
			"data": "IT"
		},
		{
			"text": "Jamaica",
			"value": "+1876",
			"data": "JM"
		},
		{
			"text": "Japan",
			"value": "+81",
			"data": "JP"
		},
		{
			"text": "Jersey",
			"value": "+44",
			"data": "JE"
		},
		{
			"text": "Jordan",
			"value": "+962",
			"data": "JO"
		},
		{
			"text": "Kazakhstan",
			"value": "+77",
			"data": "KZ"
		},
		{
			"text": "Kenya",
			"value": "+254",
			"data": "KE"
		},
		{
			"text": "Kiribati",
			"value": "+686",
			"data": "KI"
		},
		{
			"text": "Korea, Democratic People's Republic of Korea",
			"value": "+850",
			"data": "KP"
		},
		{
			"text": "Korea, Republic of South Korea",
			"value": "+82",
			"data": "KR"
		},
		{
			"text": "Kuwait",
			"value": "+965",
			"data": "KW"
		},
		{
			"text": "Kyrgyzstan",
			"value": "+996",
			"data": "KG"
		},
		{
			"text": "Laos",
			"value": "+856",
			"data": "LA"
		},
		{
			"text": "Latvia",
			"value": "+371",
			"data": "LV"
		},
		{
			"text": "Lebanon",
			"value": "+961",
			"data": "LB"
		},
		{
			"text": "Lesotho",
			"value": "+266",
			"data": "LS"
		},
		{
			"text": "Liberia",
			"value": "+231",
			"data": "LR"
		},
		{
			"text": "Libyan Arab Jamahiriya",
			"value": "+218",
			"data": "LY"
		},
		{
			"text": "Liechtenstein",
			"value": "+423",
			"data": "LI"
		},
		{
			"text": "Lithuania",
			"value": "+370",
			"data": "LT"
		},
		{
			"text": "Luxembourg",
			"value": "+352",
			"data": "LU"
		},
		{
			"text": "Macao",
			"value": "+853",
			"data": "MO"
		},
		{
			"text": "Macedonia",
			"value": "+389",
			"data": "MK"
		},
		{
			"text": "Madagascar",
			"value": "+261",
			"data": "MG"
		},
		{
			"text": "Malawi",
			"value": "+265",
			"data": "MW"
		},
		{
			"text": "Malaysia",
			"value": "+60",
			"data": "MY"
		},
		{
			"text": "Maldives",
			"value": "+960",
			"data": "MV"
		},
		{
			"text": "Mali",
			"value": "+223",
			"data": "ML"
		},
		{
			"text": "Malta",
			"value": "+356",
			"data": "MT"
		},
		{
			"text": "Marshall Islands",
			"value": "+692",
			"data": "MH"
		},
		{
			"text": "Martinique",
			"value": "+596",
			"data": "MQ"
		},
		{
			"text": "Mauritania",
			"value": "+222",
			"data": "MR"
		},
		{
			"text": "Mauritius",
			"value": "+230",
			"data": "MU"
		},
		{
			"text": "Mayotte",
			"value": "+262",
			"data": "YT"
		},
		{
			"text": "Mexico",
			"value": "+52",
			"data": "MX"
		},
		{
			"text": "Micronesia, Federated States of Micronesia",
			"value": "+691",
			"data": "FM"
		},
		{
			"text": "Moldova",
			"value": "+373",
			"data": "MD"
		},
		{
			"text": "Monaco",
			"value": "+377",
			"data": "MC"
		},
		{
			"text": "Mongolia",
			"value": "+976",
			"data": "MN"
		},
		{
			"text": "Montenegro",
			"value": "+382",
			"data": "ME"
		},
		{
			"text": "Montserrat",
			"value": "+1664",
			"data": "MS"
		},
		{
			"text": "Morocco",
			"value": "+212",
			"data": "MA"
		},
		{
			"text": "Mozambique",
			"value": "+258",
			"data": "MZ"
		},
		{
			"text": "Myanmar",
			"value": "+95",
			"data": "MM"
		},
		{
			"text": "Namibia",
			"value": "+264",
			"data": "NA"
		},
		{
			"text": "Nauru",
			"value": "+674",
			"data": "NR"
		},
		{
			"text": "Nepal",
			"value": "+977",
			"data": "NP"
		},
		{
			"text": "Netherlands",
			"value": "+31",
			"data": "NL"
		},
		{
			"text": "Netherlands Antilles",
			"value": "+599",
			"data": "AN"
		},
		{
			"text": "New Caledonia",
			"value": "+687",
			"data": "NC"
		},
		{
			"text": "New Zealand",
			"value": "+64",
			"data": "NZ"
		},
		{
			"text": "Nicaragua",
			"value": "+505",
			"data": "NI"
		},
		{
			"text": "Niger",
			"value": "+227",
			"data": "NE"
		},
		{
			"text": "Nigeria",
			"value": "+234",
			"data": "NG"
		},
		{
			"text": "Niue",
			"value": "+683",
			"data": "NU"
		},
		{
			"text": "Norfolk Island",
			"value": "+672",
			"data": "NF"
		},
		{
			"text": "Northern Mariana Islands",
			"value": "+1670",
			"data": "MP"
		},
		{
			"text": "Norway",
			"value": "+47",
			"data": "NO"
		},
		{
			"text": "Oman",
			"value": "+968",
			"data": "OM"
		},
		{
			"text": "Pakistan",
			"value": "+92",
			"data": "PK"
		},
		{
			"text": "Palau",
			"value": "+680",
			"data": "PW"
		},
		{
			"text": "Palestinian Territory, Occupied",
			"value": "+970",
			"data": "PS"
		},
		{
			"text": "Panama",
			"value": "+507",
			"data": "PA"
		},
		{
			"text": "Papua New Guinea",
			"value": "+675",
			"data": "PG"
		},
		{
			"text": "Paraguay",
			"value": "+595",
			"data": "PY"
		},
		{
			"text": "Peru",
			"value": "+51",
			"data": "PE"
		},
		{
			"text": "Philippines",
			"value": "+63",
			"data": "PH"
		},
		{
			"text": "Pitcairn",
			"value": "+872",
			"data": "PN"
		},
		{
			"text": "Poland",
			"value": "+48",
			"data": "PL"
		},
		{
			"text": "Portugal",
			"value": "+351",
			"data": "PT"
		},
		{
			"text": "Puerto Rico",
			"value": "+1939",
			"data": "PR"
		},
		{
			"text": "Qatar",
			"value": "+974",
			"data": "QA"
		},
		{
			"text": "Romania",
			"value": "+40",
			"data": "RO"
		},
		{
			"text": "Russia",
			"value": "+7",
			"data": "RU"
		},
		{
			"text": "Rwanda",
			"value": "+250",
			"data": "RW"
		},
		{
			"text": "Reunion",
			"value": "+262",
			"data": "RE"
		},
		{
			"text": "Saint Barthelemy",
			"value": "+590",
			"data": "BL"
		},
		{
			"text": "Saint Helena, Ascension and Tristan Da Cunha",
			"value": "+290",
			"data": "SH"
		},
		{
			"text": "Saint Kitts and Nevis",
			"value": "+1869",
			"data": "KN"
		},
		{
			"text": "Saint Lucia",
			"value": "+1758",
			"data": "LC"
		},
		{
			"text": "Saint Martin",
			"value": "+590",
			"data": "MF"
		},
		{
			"text": "Saint Pierre and Miquelon",
			"value": "+508",
			"data": "PM"
		},
		{
			"text": "Saint Vincent and the Grenadines",
			"value": "+1784",
			"data": "VC"
		},
		{
			"text": "Samoa",
			"value": "+685",
			"data": "WS"
		},
		{
			"text": "San Marino",
			"value": "+378",
			"data": "SM"
		},
		{
			"text": "Sao Tome and Principe",
			"value": "+239",
			"data": "ST"
		},
		{
			"text": "Saudi Arabia",
			"value": "+966",
			"data": "SA"
		},
		{
			"text": "Senegal",
			"value": "+221",
			"data": "SN"
		},
		{
			"text": "Serbia",
			"value": "+381",
			"data": "RS"
		},
		{
			"text": "Seychelles",
			"value": "+248",
			"data": "SC"
		},
		{
			"text": "Sierra Leone",
			"value": "+232",
			"data": "SL"
		},
		{
			"text": "Singapore",
			"value": "+65",
			"data": "SG"
		},
		{
			"text": "Slovakia",
			"value": "+421",
			"data": "SK"
		},
		{
			"text": "Slovenia",
			"value": "+386",
			"data": "SI"
		},
		{
			"text": "Solomon Islands",
			"value": "+677",
			"data": "SB"
		},
		{
			"text": "Somalia",
			"value": "+252",
			"data": "SO"
		},
		{
			"text": "South Africa",
			"value": "+27",
			"data": "ZA"
		},
		{
			"text": "South Sudan",
			"value": "+211",
			"data": "SS"
		},
		{
			"text": "South Georgia and the South Sandwich Islands",
			"value": "+500",
			"data": "GS"
		},
		{
			"text": "Spain",
			"value": "+34",
			"data": "ES"
		},
		{
			"text": "Sri Lanka",
			"value": "+94",
			"data": "LK"
		},
		{
			"text": "Sudan",
			"value": "+249",
			"data": "SD"
		},
		{
			"text": "Suriname",
			"value": "+597",
			"data": "SR"
		},
		{
			"text": "Svalbard and Jan Mayen",
			"value": "+47",
			"data": "SJ"
		},
		{
			"text": "Swaziland",
			"value": "+268",
			"data": "SZ"
		},
		{
			"text": "Sweden",
			"value": "+46",
			"data": "SE"
		},
		{
			"text": "Switzerland",
			"value": "+41",
			"data": "CH"
		},
		{
			"text": "Syrian Arab Republic",
			"value": "+963",
			"data": "SY"
		},
		{
			"text": "Taiwan",
			"value": "+886",
			"data": "TW"
		},
		{
			"text": "Tajikistan",
			"value": "+992",
			"data": "TJ"
		},
		{
			"text": "Tanzania, United Republic of Tanzania",
			"value": "+255",
			"data": "TZ"
		},
		{
			"text": "Thailand",
			"value": "+66",
			"data": "TH"
		},
		{
			"text": "Timor-Leste",
			"value": "+670",
			"data": "TL"
		},
		{
			"text": "Togo",
			"value": "+228",
			"data": "TG"
		},
		{
			"text": "Tokelau",
			"value": "+690",
			"data": "TK"
		},
		{
			"text": "Tonga",
			"value": "+676",
			"data": "TO"
		},
		{
			"text": "Trinidad and Tobago",
			"value": "+1868",
			"data": "TT"
		},
		{
			"text": "Tunisia",
			"value": "+216",
			"data": "TN"
		},
		{
			"text": "Turkey",
			"value": "+90",
			"data": "TR"
		},
		{
			"text": "Turkmenistan",
			"value": "+993",
			"data": "TM"
		},
		{
			"text": "Turks and Caicos Islands",
			"value": "+1649",
			"data": "TC"
		},
		{
			"text": "Tuvalu",
			"value": "+688",
			"data": "TV"
		},
		{
			"text": "Uganda",
			"value": "+256",
			"data": "UG"
		},
		{
			"text": "Ukraine",
			"value": "+380",
			"data": "UA"
		},
		{
			"text": "United Arab Emirates",
			"value": "+971",
			"data": "AE"
		},
		{
			"text": "United Kingdom",
			"value": "+44",
			"data": "GB"
		},
		{
			"text": "United States",
			"value": "+1",
			"data": "US"
		},
		{
			"text": "Uruguay",
			"value": "+598",
			"data": "UY"
		},
		{
			"text": "Uzbekistan",
			"value": "+998",
			"data": "UZ"
		},
		{
			"text": "Vanuatu",
			"value": "+678",
			"data": "VU"
		},
		{
			"text": "Venezuela, Bolivarian Republic of Venezuela",
			"value": "+58",
			"data": "VE"
		},
		{
			"text": "Vietnam",
			"value": "+84",
			"data": "VN"
		},
		{
			"text": "Virgin Islands, British",
			"value": "+1284",
			"data": "VG"
		},
		{
			"text": "Virgin Islands, U.S.",
			"value": "+1340",
			"data": "VI"
		},
		{
			"text": "Wallis and Futuna",
			"value": "+681",
			"data": "WF"
		},
		{
			"text": "Yemen",
			"value": "+967",
			"data": "YE"
		},
		{
			"text": "Zambia",
			"value": "+260",
			"data": "ZM"
		},
		{
			"text": "Zimbabwe",
			"value": "+263",
			"data": "ZW"
		}
	];

}
