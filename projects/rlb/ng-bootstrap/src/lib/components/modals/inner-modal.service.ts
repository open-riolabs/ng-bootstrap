import { MediaMatcher } from '@angular/cdk/layout';
import { ComponentRef, Injectable, Type } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { AbstractRegistryService } from '../../shared/abstract.registry.service';
import { BuilderComponent } from '../../shared/component-builder';
import { GenericComponent } from '../../shared/component-builder/generic.component';
import { ModalCloseReason } from '../../shared/types';
import { UniqueIdService } from '../../shared/unique-id.service';
import { ModalData } from './data/modal-data';
import { ModalOptions } from './data/modal-options';
import { ModalResult } from './data/modal-resutl';
import { ModalRegistryOptions } from './options/modal-registry.options';

@Injectable({
  providedIn: 'root',
})
export class InnerModalService extends AbstractRegistryService<Type<any>> {

  private allModals: { id: string; modal: ComponentRef<GenericComponent>, subject: Subject<ModalResult<any>>; }[] = [];
  private builders: BuilderComponent<InnerModalService>[] = [];

  registerBuilder(builder: BuilderComponent<InnerModalService>) {
    if (this.builders.length > 0) {
      throw new Error(
        'Only one modal builder is supported. Please remove the others.',
      );
    }
    this.builders.push(builder);
  }

  removeBuilder(builderId: string) {
    this.builders = this.builders.filter((_) => false);
  }

  getBuilder(): BuilderComponent<InnerModalService> {
    if (this.builders.length === 0) {
      throw new Error('No modal builder is registered.');
    }
    return this.builders[0];
  }

  constructor(
    options: ModalRegistryOptions,
    private mediaMatcher: MediaMatcher,
    private uniqueIdService: UniqueIdService,
  ) {
    super();
    if (Array.isArray(options)) {
      const modals = (options as ModalRegistryOptions[])
        .reverse()
        .map((o) => o.modals)
        .flat();
      for (const modal of modals) {
        Object.keys(modal).forEach((k) => this.add(k, modal[k]));
      }
    } else {
      if (options && options.modals) {
        Object.keys(options.modals).forEach((k) => this.add(k, options.modals[k]));
      }
    }
  }

  public openModal<Input = any, Output = any>(
    name: string,
    data: ModalData<Input>,
    options?: ModalOptions,
  ): Observable<ModalResult<Output>> {
    const modalId = `rlb-modal${this.uniqueIdService.id}`;
    const modal = this.getBuilder().buildComponent<
      ModalData<Input>,
      ModalOptions
    >(
      {
        name,
        data,
      },
      {
        inputs: { id: modalId },
        setInstance: true,
      },
      options,
    );
    this.allModals.push({ id: modalId, modal: modal!, subject: new Subject<ModalResult<Output>>() });
    const subject = this.allModals.find((d) => d.id === modalId)?.subject;
    if (!subject) {
      return of({ reason: 'cancel', result: undefined } as ModalResult<Output>);
    }
    return subject.asObservable();
  }

  public eventModal(
    event: string,
    reason: ModalCloseReason,
    id: string,
    result: any,
  ): void {
    if (event === 'hidden') {
      const modal = this.allModals.find((d) => d.id === id);
      if (modal) {
        modal.modal.destroy();
        this.allModals = this.allModals.filter((d) => d.id !== id);
      }
      modal?.subject.next({ reason, result });
      modal?.subject.complete();
    }
  }
}
