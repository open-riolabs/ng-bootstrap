import { RlbBootstrapOptions } from '../../../rlb-bootstrap';
import { ToastRegistry } from '../options/toast-registry';
import { ToastRegistryOptions } from '../options/toast-registry.options';

export function toastRegistryProvider(options?: ToastRegistry) {
  return (rootOptions?: RlbBootstrapOptions): ToastRegistryOptions => {
    const registryOptions = new ToastRegistryOptions();
    if (!options && rootOptions && rootOptions.toasts) {
      registryOptions.toasts = [...rootOptions.toasts];
      //registryOptions.modals = [RlbFormComponent, ...rootOptions.toasts];
      return registryOptions;
    }
    if (options && options.toasts) {
      registryOptions.toasts = options.toasts;
      return registryOptions;
    }
    registryOptions.toasts = [];
    return registryOptions;
  };
}
