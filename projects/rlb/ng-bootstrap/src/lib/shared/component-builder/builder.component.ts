import { ComponentRef, Injectable, Signal, Type } from '@angular/core';
import { AbstractRegistryService } from '../abstract.registry.service';
import { ComponentHostDirective } from './component-host.directive';
import { ComponentCreationOptions } from './data/component-creation-options';
import { ComponentInfo } from './data/component-info';
import { GenericComponent } from './generic.component';

@Injectable()
export abstract class BuilderComponent<
  T extends AbstractRegistryService<Function>,
> {
  abstract component: ComponentHostDirective;
  abstract builderId: string | Signal<string>;

  constructor(protected registryService: T) { }

  public buildComponent<Data = any, Options = any>(
    component: ComponentInfo<string, Data>,
    creationOptions?: ComponentCreationOptions,
    componentOptions?: Options,
  ): ComponentRef<GenericComponent> | null {
    if (component.name) {
      const componentType = this.registryService.get(
        component.name,
      ) as Type<any>;
      const componentRef =
        this.component.viewContainerRef.createComponent<GenericComponent>(
          componentType,
        );
      componentRef.setInput('data', component.data);
      if (creationOptions?.setInstance === true) {
        componentRef.setInput(
          creationOptions?.instanceInputName || 'data-instance',
          componentRef.instance,
        );
      }
      if (componentOptions) {
        componentRef.setInput('data-options', componentOptions);
      }
      if (creationOptions && creationOptions.inputs) {
        for (const key in creationOptions.inputs) {
          componentRef.setInput(key, creationOptions.inputs[key]);
        }
      }
      return componentRef;
    }
    return null;
  }
}
