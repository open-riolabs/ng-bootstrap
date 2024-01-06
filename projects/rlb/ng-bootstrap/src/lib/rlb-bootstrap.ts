import { InjectionToken } from '@angular/core';
import { ModalRegistry } from './components/modals/options/modal-registry';
import { ToastRegistry } from './components/toast/options/toast-registry';

export var FOR_ROOT_OPTIONS_TOKEN = new InjectionToken<RlbBootstrapOptions>(
  'forRoot() RlbBootstrap configuration.',
);

export interface RlbBootstrapOptions extends ModalRegistry, ToastRegistry {}
