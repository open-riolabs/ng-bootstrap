import { SearchModalComponent } from '../../../modals/search-modal.component';
import { RlbBootstrapOptions } from '../../../rlb-bootstrap';
import { ModalRegistry } from '../options/modal-registry';
import { ModalRegistryOptions } from '../options/modal-registry.options';

export function modalRegistryProvider(options?: ModalRegistry) {
  return (rootOptions?: RlbBootstrapOptions): ModalRegistryOptions => {
    const registryOptions = new ModalRegistryOptions();
    if (!options && rootOptions && rootOptions.modals) {
      registryOptions.modals = [...rootOptions.modals];
      //registryOptions.modals = [RlbFormComponent, ...rootOptions.modals];
      return addLocal(registryOptions);
    }
    if (options && options.modals) {
      registryOptions.modals = options.modals;
      return addLocal(registryOptions);
    }
    registryOptions.modals = [];
    return addLocal(registryOptions);
  };
}

function addLocal(data: ModalRegistryOptions): ModalRegistryOptions {
  if (!data.modals?.includes(SearchModalComponent)) {
    data.modals?.push(SearchModalComponent);
  }
  return data;
}
