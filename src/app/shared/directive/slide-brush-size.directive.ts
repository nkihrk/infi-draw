import { Directive, HostListener } from '@angular/core';
import { SlideBrushSizeService } from '../service/module/slide-brush-size.service';

@Directive({
	selector: '[appSlideBrushSize]'
})
export class SlideBrushSizeDirective {
	constructor(private slider: SlideBrushSizeService) {}

	// Pointerdown listener
	@HostListener('pointerdown', ['$event']) onPinterDown($e): void {
		this._onDown($e);
	}

	// Pointerup listener
	@HostListener('document:pointerup', ['$event']) onPointerUp($e): void {
		this._onUp($e);
	}

	// Pointermove listener
	@HostListener('document:pointermove', ['$event']) onPointerMove($e): void {
		this._onMove($e);
	}

	// Touchstart listener
	@HostListener('touchstart', ['$event']) onTouchStart($e): void {
		this._onDown($e);
	}

	// Touchend listener
	@HostListener('document:touchend', ['$event']) onTouchEnd($e): void {
		this._onUp($e);
	}

	// Touchmove listener
	@HostListener('document:touchmove', ['$event']) onTouchMove($e): void {
		this._onMove($e);
	}

	// Down event
	_onDown($e: any): void {
		let clientX: number;

		if ($e.type === 'touchmove') {
			clientX = $e.touches[0].clientX;
		} else {
			clientX = $e.clientX;
		}

		this.slider.activate(clientX);
	}

	// Up event
	_onUp($e: any): void {
		this.slider.disableSlider();
	}

	// Move event
	_onMove($e: any): void {
		let clientX: number;

		if ($e.type === 'touchmove') {
			clientX = $e.touches[0].clientX;
		} else {
			clientX = $e.clientX;
		}

		this.slider.changeSlideAmount(clientX);
	}
}
