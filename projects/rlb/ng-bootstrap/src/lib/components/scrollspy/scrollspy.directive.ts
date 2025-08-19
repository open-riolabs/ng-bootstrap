import {
	AfterViewInit,
	booleanAttribute,
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ScrollSpy } from 'bootstrap';

@Directive({
	selector: '[rlb-scrollspy]',
	host: {
		'attr.data-bs-spy': 'scroll',
		'[attr.data-bs-target]': 'target',
		'attr.tabindex': '0',
		'[attr.data-bs-root-margin]': 'rootMargin',
		'[attr.data-bs-smooth-scroll]': 'smooth',
		'[style.position]': '"relative"',
		'[style.overflow-y]': '"auto"',
		'[style.height]': 'height',
	},
	standalone: false
})
export class ScrollspyDirective implements AfterViewInit, OnDestroy, OnChanges {
	@Input({ alias: 'rlb-scrollspy-target', required: true }) target?: string;
	@Input({ alias: 'height', required: true }) height?: string;
	@Input({ alias: 'scroll-smooth', transform: booleanAttribute }) smooth?: boolean;
	@Input({ alias: 'scroll-root-margin' }) rootMargin: string = '';
	@Input({ alias: 'scroll-threshold' }) threshold: number[] = [];
	
	@Output('scroll-change') scroll = new EventEmitter<void>();
	
	private scrollSpy!: ScrollSpy;
	private boundScrollHandler = this.__scroll_handler.bind(this);
	
	private linkClickHandlers: Array<{ element: Element, handler: EventListener }> = [];
	
	constructor(private elementRef: ElementRef<HTMLElement>) {
	}
	
	ngAfterViewInit() {
		const nav = document.querySelector(this.target!);
		if (!nav) return;
		
		// Bind custom scroll behavior on nav links
		nav.querySelectorAll('a[href^="#"]').forEach(link => {
			const handler = (event: Event) => {
				event.preventDefault();
				
				const href = (link as HTMLAnchorElement).getAttribute('href');
				if (!href || href.length <= 1 || !href.startsWith('#')) return;
				
				const id = href.slice(1);
				const targetEl = this.elementRef.nativeElement.querySelector(`#${id}`);
				
				if (targetEl) {
					targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
					this.scrollSpy.refresh();
				}
			};
			
			link.addEventListener('click', handler);
			this.linkClickHandlers.push({ element: link, handler });
		});
		
		// Initialize ScrollSpy
		this.scrollSpy = ScrollSpy.getOrCreateInstance(this.elementRef.nativeElement, {
			target: this.target,
			rootMargin: this.rootMargin,
			threshold: this.threshold,
		});
		
		this.elementRef.nativeElement.addEventListener(
			'activate.bs.scrollspy',
			this.boundScrollHandler
		);
		
		this.scrollSpy.refresh();
	}
	
	ngOnChanges(changes: SimpleChanges) {
		this.scrollSpy?.refresh();
	}
	
	ngOnDestroy() {
		// Clean up link click handlers
		this.linkClickHandlers.forEach(({ element, handler }) => {
			element.removeEventListener('click', handler);
		});
		this.linkClickHandlers = [];
		
		this.elementRef.nativeElement.removeEventListener(
			'activate.bs.scrollspy',
			this.boundScrollHandler
		);
		
		this.scrollSpy?.dispose();
	}
	
	private __scroll_handler(event: Event) {
		this.scroll.emit();
	}
}
