import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
	selector: '[appActiveMenu]'
})
export class ActiveMenuDirective {
	private target: HTMLElement;

	constructor(el: ElementRef) {
		this.target = el.nativeElement;
	}

	// Pointerenter listener
	@HostListener('pointerenter', ['$event']) onPointerEnter($e): void {
		const children: HTMLCollection = this.target.children;

		if (
			children.length === 2 &&
			!children[0].classList.contains('active') &&
			!children[1].classList.contains('active')
		) {
			children[0].classList.add('active');
			children[1].classList.add('active');
		}
	}

	// Pointerleave listener
	@HostListener('pointerleave', ['$event']) onPointerLeave($e): void {
		const isAllowedToRemoveActive = !!$e.relatedTarget
			? !$e.relatedTarget.classList.contains('prevent-pointer-leave')
			: false;

		if (isAllowedToRemoveActive) {
			const children: HTMLCollection = this.target.children;

			if (children.length === 2) {
				if (children[0].classList.contains('active')) {
					children[0].classList.remove('active');
				}
				if (children[1].classList.contains('active')) {
					children[1].classList.remove('active');
				}
			}
		}
	}
}
