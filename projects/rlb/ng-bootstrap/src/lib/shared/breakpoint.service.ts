import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  /**
   * Observable that emits true when the screen width is <= 992px.
   * This corresponds to the BS992 breakpoint used in the sidebar.
   */
  isMobile$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 992px)'])
    .pipe(
      map((state: BreakpointState) => state.matches),
      shareReplay(1)
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  /**
   * Returns the current mobile state.
   */
  get isMobile(): boolean {
    return this.breakpointObserver.isMatched('(max-width: 992px)');
  }
}
