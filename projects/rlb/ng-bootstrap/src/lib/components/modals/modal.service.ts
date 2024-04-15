import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { InnerModalService } from './inner-modal.service';
import { ModalData } from './data/modal-data';
import { ModalResult } from './data/modal-resutl';
import { ModalOptions } from './data/modal-options';
import { CommonModalData } from '../../modals';
import { ModalType } from '../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalService: InnerModalService) { }

  public openModal<Input = any, Output = any>(
    name: string,
    data: ModalData<Input>,
    options?: ModalOptions,
  ): Observable<ModalResult<Output>> {
    return this.modalService.openModal<Input, Output>(name, data, options);
  }

  public openSimpleModal(title: string, body: string, header?: string, ok?: string, type?: ModalType, options?: ModalOptions) {
    return this.openModal<CommonModalData, void>('rlb-common', {
      title,
      content: {
        header,
        body,
      },
      ok,
      type
    }, options);
  }

  public openConfirmModal(title: string, body: string, header?: string, ok?: string, cancel?: string, type?: ModalType, options?: ModalOptions) {
    return this.openModal<CommonModalData, void>('rlb-common', {
      title,
      content: {
        header,
        body,
      },
      ok,
      cancel,
      type
    }, options);
  }
}
