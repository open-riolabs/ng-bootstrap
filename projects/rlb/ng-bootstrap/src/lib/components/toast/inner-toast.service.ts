import { ComponentRef, Injectable, Type } from '@angular/core';
import { Observable, filter, map, Subject } from 'rxjs';
import { ToastData } from './data/toast-data';
import { AbstractRegistryService } from '../../shared/abstract.registry.service';
import { ToastRegistryOptions } from './options/toast-registry.options';
import { GenericComponent } from '../../shared/component-builder/generic.component';
import { UniqueIdService } from '../../shared/unique-id.service';
import { ModalCloseReason } from '../../shared/types';
import { ToastResult } from './data/toast-resutl';
import { BuilderComponent } from '../../shared/component-builder';
import { ModalOptions } from '../modals';
import { ToastOptions } from './data/toast-options';

@Injectable({
  providedIn: 'root',
})
export class InnerToastService extends AbstractRegistryService<Type<any>> {
  public modalClose: Subject<ToastResult<any> & { id: string }> = new Subject<
    ToastResult<any> & { id: string }
  >();
  private allModals: { id: string; toast: ComponentRef<GenericComponent> }[] =
    [];
  private builders: BuilderComponent<InnerToastService>[] = [];

  registerBuilder(builder: BuilderComponent<InnerToastService>) {
    this.builders.push(builder);
  }

  removeBuilder(builderId: string) {
    this.builders = this.builders.filter((b) => b.builderId !== builderId);
  }

  getBuilder(builderId: string): BuilderComponent<InnerToastService> {
    if (!builderId) throw new Error('builderId is required');
    const count = this.builders.filter((b) => b.builderId === builderId).length;
    if (count === 0) throw new Error(`builderId not found: ${builderId}`);
    if (count > 1)
      console.warn(
        `Toast builderId is not unique: ${builderId}. Will use the first one.`,
      );
    return this.builders.find(
      (b) => b.builderId === builderId,
    ) as BuilderComponent<InnerToastService>;
  }

  constructor(
    options: ToastRegistryOptions,
    private uniqueIdService: UniqueIdService,
  ) {
    super();
    if (Array.isArray(options)) {
      const modals = (options as ToastRegistryOptions[])
        .reverse()
        .map((o) => o.toasts)
        .flat();
      for (const modal of modals) {
        this.add(modal);
      }
    } else {
      if (options && options.toasts && options.toasts.length > 0) {
        for (const modal of options.toasts) {
          this.add(modal);
        }
      }
    }
  }

  public openToast<Input = any, Output = any>(
    builderId: string,
    componentName: string,
    data: ToastData<Input>,
    options?: ToastOptions,
  ): Observable<ToastResult<Output> | null> {
    const toastId = `rlb-toast${this.uniqueIdService.id}`;
    const toast = this.getBuilder(builderId).buildComponent<
      ToastData<Input>,
      ToastOptions
    >(
      {
        name: componentName,
        data,
      },
      {
        inputs: { id: toastId },
        setInstance: true,
      },
      options,
    );
    this.allModals.push({ id: toastId, toast: toast! });
    return this.modalClose.asObservable().pipe(
      filter((o) => o?.id === toastId),
      map(({ reason, result }) => {
        return { reason, result };
      }),
    );
  }

  public eventToast(
    event: string,
    reason: ModalCloseReason,
    id: string,
    result: any,
  ): void {
    if (event === 'hidden') {
      const toast = this.allModals.find((d) => d.id === id);
      if (toast) {
        toast.toast.destroy();
        this.allModals = this.allModals.filter((d) => d.id !== id);
      }
      this.modalClose.next({ reason, result, id });
    }
  }
}
