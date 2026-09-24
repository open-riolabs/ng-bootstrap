import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS } from '../../../shared/docs';

interface InputLink {
  name: string;
  icon: string;
  desc: string;
  link: string;
}

interface InputGroup {
  title: string;
  items: InputLink[];
}

@Component({
  selector: 'app-inputs-home',
  templateUrl: './inputs-home.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class InputsHomeComponent {
  groups: InputGroup[] = [
    {
      title: 'Text',
      items: [
        { name: 'Input', icon: 'bi-input-cursor', desc: 'Text, number, password and date-time fields.', link: '/inputs/input' },
        { name: 'Textarea', icon: 'bi-textarea-resize', desc: 'Multi-line text with an optional row count.', link: '/inputs/textarea' },
        { name: 'Input group', icon: 'bi-box', desc: 'A field with addons before or after it.', link: '/inputs/input-group' },
        { name: 'Validation', icon: 'bi-check2-circle', desc: 'Bootstrap validation messages for any control.', link: '/inputs/input-validation' },
      ],
    },
    {
      title: 'Choice',
      items: [
        { name: 'Select', icon: 'bi-caret-down-square', desc: 'Native select with rlb-option children.', link: '/inputs/select' },
        { name: 'Select chips', icon: 'bi-tags', desc: 'Multi-select that stays one line tall however much is picked.', link: '/inputs/select-chips' },
        { name: 'Option', icon: 'bi-list-ul', desc: 'The option used by select and datalist.', link: '/inputs/option' },
        { name: 'Checkbox', icon: 'bi-check2-square', desc: 'Single checkbox bound to a control.', link: '/inputs/checkbox' },
        { name: 'Radio', icon: 'bi-ui-radios', desc: 'Radio groups with a shared name.', link: '/inputs/radio' },
        { name: 'Switch', icon: 'bi-toggles2', desc: 'Toggle rendered as a Bootstrap switch.', link: '/inputs/switch' },
      ],
    },
    {
      title: 'Search & suggestions',
      items: [
        { name: 'Autocomplete', icon: 'bi-menu-button', desc: 'Searchable input over an array, a promise or an observable — plus the country, dial-code and timezone variants.', link: '/inputs/autocomplete' },
        { name: 'Datalist', icon: 'bi-list', desc: 'Native suggestions attached to a text field.', link: '/inputs/datalist' },
      ],
    },
    {
      title: 'Dates',
      items: [
        { name: 'Date picker', icon: 'bi-calendar3', desc: 'One day or a range, as an IDateTz at local midnight in its own timezone.', link: '/inputs/datepicker' },
      ],
    },
    {
      title: 'Files & values',
      items: [
        { name: 'File', icon: 'bi-file-earmark', desc: 'File input bound to a control.', link: '/inputs/file' },
        { name: 'File drag & drop', icon: 'bi-file-earmark-arrow-up', desc: 'Drop zone with a progress bar and a file list.', link: '/inputs/file-dnd' },
        { name: 'Colour', icon: 'bi-palette', desc: 'Colour picker bound to a hex value.', link: '/inputs/color' },
        { name: 'Range', icon: 'bi-sliders', desc: 'Slider with min, max and step.', link: '/inputs/range' },
      ],
    },
    {
      title: 'Whole forms',
      items: [
        { name: 'Form fields', icon: 'bi-ui-checks-grid', desc: 'Builds a form from a plain object: one key per control, with its type, width and validators.', link: '/inputs/form-fields' },
      ],
    },
  ];
}
