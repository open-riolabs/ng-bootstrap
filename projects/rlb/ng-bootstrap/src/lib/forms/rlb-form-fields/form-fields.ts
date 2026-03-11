import { EventEmitter, InputSignal, OutputEmitterRef } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

export interface FormFieldsDefinition {
  [k: string]: _FormField;
}

interface _FormField {
  name: string;
  label?: string;
  type:
  | 'text'
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'url'
  | 'checkbox'
  | 'switch'
  | 'textarea'
  | string;
  cols?: string;
  validators?: ValidatorFn | ValidatorFn[];
}

export interface FormField extends _FormField {
  property: string;
}

export interface IForm<Result = any> {
  fields?: FormFieldsDefinition | InputSignal<FormFieldsDefinition | undefined>;
  submit: EventEmitter<Result> | OutputEmitterRef<Result>;
}
