import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private itemClickedSource = new Subject<void>();
  itemClicked$ = this.itemClickedSource.asObservable();

  /**
   * Whether the sidebar is collapsed.
   *
   * This signal is the only state: `rlb-sidebar` mirrors it onto its own host as the `collapsed`
   * class, which is what the layout stylesheet reacts to. The service used to reach into the page
   * instead — `document.getElementById('sidebar')` plus a `classList.toggle` — which threw on the
   * server, required every consumer to put that exact id on the element, and silently did nothing
   * for a second sidebar. It also toggled an `expanded` class on `.rlb-content` that no stylesheet
   * in this library has ever defined.
   */
  isCollapsed = signal(false);

  notifyItemClicked() {
    this.itemClickedSource.next();
  }

  public setCollapsed(collapsed: boolean) {
    this.isCollapsed.set(collapsed);
  }
}
