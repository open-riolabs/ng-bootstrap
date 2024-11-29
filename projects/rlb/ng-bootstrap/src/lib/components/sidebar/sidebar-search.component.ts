import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { HeaderLogo, HeaderUser, SidebarMode } from './sidebar-mode';
import { ModalService } from '../modals';
import { SearchModalInput } from '../../modals/search-modal.data';

@Component({
    selector: 'rlb-sidebar-search',
    template: `
    <ng-template #template>
      <ng-container *ngIf="open">
        <div class="search">
          <rlb-input-group validate>
            <rlb-input
              name="search"
              required
              class="search-input"
              [placeholder]="searchPlaceholder"
              [(ngModel)]="text"
              (keyup.enter)="onEnter()"
            >
            </rlb-input>
            <button color="light" after rlb-button outline (click)="onEnter()">
              <i class="bi bi-search"></i>
            </button>
            <rlb-input-validation />
          </rlb-input-group>
        </div>
      </ng-container>
      <ng-container *ngIf="!open">
        <a class="item" (click)="openSearch()">
          <i class="bi bi-search"></i>
        </a>
      </ng-container>
    </ng-template>
  `,
    standalone: false
})
export class SidebarSearchComponent implements OnInit {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private modalService: ModalService,
  ) { }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;
  open: boolean = false;
  sidebarId: string = '';
  text?: string;

  @Input({ alias: 'search-title', required: true }) searchTitle: string = 'Search';
  @Input({ alias: 'search-placeholder' }) searchPlaceholder?: string;
  @Input({ alias: 'search-text' }) searchText?: string;
  @Output('on-search') search: EventEmitter<string | null> = new EventEmitter<string | null>();

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  openSearch() {
    this.modalService
      .openModal<SearchModalInput, string>('rlb-search', {
        title: this.searchTitle,
        content: {
          placeholder: this.searchPlaceholder,
          searchText: this.searchText,
        },
        ok: 'OK',
        type: 'info',
      })
      .subscribe((o) => {
        if (o?.reason === 'ok') {
          this.search.emit(o.result || null);
        }
      });
  }

  onEnter() {
    this.search.emit(this.text || null);
  }
}
