import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionsComponent } from './accordions.component';

describe('AccordionsComponent', () => {
  let component: AccordionsComponent;
  let fixture: ComponentFixture<AccordionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccordionsComponent],
    });
    fixture = TestBed.createComponent(AccordionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // The page renders open accordions, so Bootstrap's Collapse starts a ~350ms
  // transition on init. Tearing the fixture down mid-transition disposes the
  // Collapse instance while its transitionend callback is still queued, and the
  // callback then dereferences the nulled element. Let the transition settle first.
  afterEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
