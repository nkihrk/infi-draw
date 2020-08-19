import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
	selector: '[appMenu]'
})
export class MenuDirective {
	@Output() isHover = new EventEmitter<boolean>();
	@Output() isPointerDown = new EventEmitter<boolean>();

	constructor() {}

	// Pointerenter listener
	@HostListener('pointerenter', ['$event']) onPointerEnter($e): void {
		$e.stopPropagation();
		this.isHover.emit(true);
	}

	// Pointerenter listener
	@HostListener('pointerleave', ['$event']) onPointerLeave($e): void {
		$e.stopPropagation();
		this.isHover.emit(false);
	}
	// Pointerdown listener
	@HostListener('document:pointerdown', ['$event']) onPointerdown($e): void {
		$e.stopPropagation();
		this.isPointerDown.emit(true);
	}
}
