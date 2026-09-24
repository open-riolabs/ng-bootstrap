import { Component, DOCUMENT, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

import { SHARED_IMPORTS } from './shared-imports';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [SHARED_IMPORTS, RouterModule],
})
export class AppComponent {
  title = 'ng-bootstrap';

  private router = inject(Router);
  private document = inject(DOCUMENT);

  constructor() {
    /*
      Scrolling, by hand.

      The router's own anchorScrolling and scrollPositionRestoration both go through
      ViewportScroller, which scrolls the *window* — and here the window never scrolls:
      .rlb-content does. So both would be inert, and this does the two things they would have:
      land on the #section a sidebar entry points at, and otherwise start a new page at its top
      rather than wherever the last one was left.
    */
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        const fragment = this.router.routerState.snapshot.root.fragment;
        if (fragment) this.scrollTo(fragment);
        else this.document.querySelector('.rlb-content')?.scrollTo({ top: 0 });
      });
  }

  /**
   * Waits for the section to exist before scrolling to it.
   *
   * The application is zoneless, so at NavigationEnd the page the fragment belongs to has been
   * created but not yet rendered: looking for the element straight away finds nothing. A few
   * tries cover both that and a lazy chunk still arriving.
   *
   * A timer rather than requestAnimationFrame: what is being waited for is the DOM, not a paint,
   * and rAF does not fire at all in a tab the browser is not drawing — a restored session opened
   * in the background would never scroll.
   */
  private scrollTo(fragment: string, attemptsLeft = 20): void {
    setTimeout(() => {
      const target = this.document.getElementById(fragment);
      if (target) target.scrollIntoView({ block: 'start' });
      else if (attemptsLeft > 0) this.scrollTo(fragment, attemptsLeft - 1);
    }, 16);
  }

  onSearch(text: string | null) {
    console.log(text);
  }
}
