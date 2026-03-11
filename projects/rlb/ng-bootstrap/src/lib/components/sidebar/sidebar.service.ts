import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private itemClickedSource = new Subject<void>();
  itemClicked$ = this.itemClickedSource.asObservable();

  isCollapsed = signal(false);

  notifyItemClicked() {
    this.itemClickedSource.next();
  }

  public setCollapsed(collapsed: boolean) {
    this.isCollapsed.set(collapsed);

    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.rlb-content') as HTMLElement;

    content?.classList.toggle('expanded', collapsed);
    sidebar?.classList.toggle('collapsed', collapsed);
  }
}
