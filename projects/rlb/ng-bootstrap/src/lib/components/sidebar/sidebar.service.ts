import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private itemClickedSource = new Subject<void>();
  itemClicked$ = this.itemClickedSource.asObservable();

  notifyItemClicked() {
    this.itemClickedSource.next();
  }
}
