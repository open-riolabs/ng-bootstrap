export * from './abstract-field.component';

export * from './autocomplete.component';
export * from './checkbox.component';
export * from './color.component';
export * from './datalist.component';
export * from './file.component';
export * from './input-group.component';
export * from './input.component';
export * from './options.component';
export * from './radio.component';
export * from './range.component';
export * from './select.component';
export * from './switch.component';
export * from './text-area.component';
export * from './help-text.directive';
export * from './dnd.directive';
export * from './dnd-file.component';

import { AutocompleteComponent } from './autocomplete.component';
import { CheckboxComponent } from './checkbox.component';
import { ColorComponent } from './color.component';
import { DatalistComponent } from './datalist.component';
import { FileDndComponent } from './dnd-file.component';
import { DndDirective } from './dnd.directive';
import { FileComponent } from './file.component';
import { HelpText } from './help-text.directive';
import {
  InputGroupComponent,
  InputTextGroupComponent,
} from './input-group.component';
import { InputComponent } from './input.component';
import { OptionComponent } from './options.component';
import { RadioComponent } from './radio.component';
import { RangeComponent } from './range.component';
import { SelectComponent } from './select.component';
import { SwitchComponent } from './switch.component';
import { TextAreaComponent } from './text-area.component';

export const INPUTS = [
  AutocompleteComponent,
  CheckboxComponent,
  InputComponent,
  SwitchComponent,
  TextAreaComponent,
  ColorComponent,
  DatalistComponent,
  RangeComponent,
  SelectComponent,
  RadioComponent,
  OptionComponent,
  FileComponent,
  InputGroupComponent,
  InputTextGroupComponent,
  HelpText,
  DndDirective,
  FileDndComponent,
];
