import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { InnerToastService } from './inner-toast.service';
import { ToastData } from './data/toast-data';
import { ToastResult } from './data/toast-resutl';
import { ToastOptions } from './data/toast-options';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private modalService: InnerToastService) {}

  public openToast<Input = any, Output = any>(
    containerId: string,
    name: string,
    data: ToastData<Input>,
    options?: ToastOptions,
  ): Observable<ToastResult<Output> | null> {
    return this.modalService.openToast<Input, Output>(
      containerId,
      name,
      data,
      options,
    );
  }
}
