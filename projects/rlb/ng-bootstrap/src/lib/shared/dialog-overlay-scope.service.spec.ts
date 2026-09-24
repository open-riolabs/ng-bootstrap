import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { RlbDialogOverlayScope } from './dialog-overlay-scope.service';

describe('RlbDialogOverlayScope', () => {
  let scope: RlbDialogOverlayScope;
  let container: HTMLElement;
  let first: HTMLElement;
  let second: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    scope = TestBed.inject(RlbDialogOverlayScope);
    container = TestBed.inject(OverlayContainer).getContainerElement();

    first = document.createElement('div');
    second = document.createElement('div');
    document.body.append(first, second);
  });

  afterEach(() => {
    first.remove();
    second.remove();
    TestBed.resetTestingModule();
  });

  it('leaves the container where the CDK put it until a dialog asks for it', () => {
    expect(container.parentElement).toBe(document.body);
  });

  /**
   * The whole point: Bootstrap traps focus by pulling anything outside the dialog back in, and
   * every panel this library opens is drawn by the CDK outside it.
   */
  it('moves the container inside the dialog that claims it', () => {
    scope.claim(first);

    expect(container.parentElement).toBe(first);
  });

  it('hands it back to the body when that dialog closes', () => {
    scope.claim(first);
    scope.release(first);

    expect(container.parentElement).toBe(document.body);
  });

  it('follows the topmost of several dialogs', () => {
    scope.claim(first);
    scope.claim(second);

    expect(container.parentElement).toBe(second);
  });

  /** A dialog opened over another gives it back, not to the body. */
  it('returns it to the one underneath', () => {
    scope.claim(first);
    scope.claim(second);

    scope.release(second);

    expect(container.parentElement).toBe(first);
  });

  it('is not confused by a dialog closing out of order', () => {
    scope.claim(first);
    scope.claim(second);

    scope.release(first);
    expect(container.parentElement).toBe(second);

    scope.release(second);
    expect(container.parentElement).toBe(document.body);
  });

  it('ignores a second claim from the same dialog', () => {
    scope.claim(first);
    scope.claim(first);

    scope.release(first);

    expect(container.parentElement).toBe(document.body);
  });

  it('ignores a release from a dialog that never claimed it', () => {
    scope.claim(first);

    scope.release(second);

    expect(container.parentElement).toBe(first);
  });
});
