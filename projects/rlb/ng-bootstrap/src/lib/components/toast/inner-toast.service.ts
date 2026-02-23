import { ComponentRef, Injectable, isSignal, Type } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ToastData } from './data/toast-data';
import { AbstractRegistryService } from '../../shared/abstract.registry.service';
import { ToastRegistryOptions } from './options/toast-registry.options';
import { GenericComponent } from '../../shared/component-builder/generic.component';
import { UniqueIdService } from '../../shared/unique-id.service';
import { ModalCloseReason } from '../../shared/types';
import { ToastResult } from './data/toast-resutl';
import { BuilderComponent } from '../../shared/component-builder';
import { ToastOptions } from './data/toast-options';

@Injectable({
  providedIn: 'root',
})
export class InnerToastService extends AbstractRegistryService<Type<any>> {
  private allModals: {
    id: string;
    toast: ComponentRef<GenericComponent>;
    subject: Subject<ToastResult<any>>;
  }[] = [];
  private builders: BuilderComponent<InnerToastService>[] = [];

  // Helper method to safely extract the string ID
  private getBuilderId(builder: BuilderComponent<InnerToastService>): string {
    return isSignal(builder.builderId) ? builder.builderId() : builder.builderId;
  }

  registerBuilder(builder: BuilderComponent<InnerToastService>) {
    this.builders.push(builder);
  }

  removeBuilder(builderId: string) {
    this.builders = this.builders.filter(b => this.getBuilderId(b) !== builderId);
  }

  getBuilder(builderId: string): BuilderComponent<InnerToastService> {
    if (!builderId) throw new Error('builderId is required');

    const matchingBuilders = this.builders.filter(b => this.getBuilderId(b) === builderId);
    const count = matchingBuilders.length;

    if (count === 0) throw new Error(`builderId not found: ${builderId}`);

    if (count > 1) {
      console.warn(`Toast builderId is not unique: ${builderId}. Will use the first one.`);
    }

    return matchingBuilders[0];
  }

  constructor(
    options: ToastRegistryOptions,
    private uniqueIdService: UniqueIdService,
  ) {
    super();
    if (Array.isArray(options)) {
      const toasts = (options as ToastRegistryOptions[])
        .reverse()
        .map(o => o.toasts)
        .flat();
      for (const toast of toasts) {
        Object.keys(toast).forEach(k => this.add(k, toast[k]));
      }
    } else {
      if (options && options.toasts) {
        Object.keys(options.toasts).forEach(k => this.add(k, options.toasts[k]));
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
    const toast = this.getBuilder(builderId).buildComponent<ToastData<Input>, ToastOptions>(
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
    this.allModals.push({
      id: toastId,
      toast: toast!,
      subject: new Subject<ToastResult<Output>>(),
    });
    const subject = this.allModals.find(d => d.id === toastId)?.subject;
    if (!subject) {
      return of({ reason: 'cancel', result: undefined } as ToastResult<Output>);
    }
    return subject.asObservable();
  }

  public eventToast(event: string, reason: ModalCloseReason, id: string, result: any): void {
    if (event === 'hidden') {
      const toast = this.allModals.find(d => d.id === id);
      if (toast) {
        toast.toast.destroy();
        this.allModals = this.allModals.filter(d => d.id !== id);
      }
      toast?.subject.next({ reason, result });
      toast?.subject.complete();
    }
  }
}
