import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { Key } from '../model/key.model';
import { Pointer } from '../model/pointer.model';

@Directive({
	selector: '[appEvent]'
})
export class EventDirective {
	@Output() dataSet = new EventEmitter<Pointer>();
	@Output() key = new EventEmitter<Key>();
	@Output() isUnload = new EventEmitter<any>();

	// Mouse position
	private clientX = 0;
	private clientY = 0;

	// Wheel delta
	private delta = 0;
	// Mouse button number
	private btn = 0;

	// Flgs
	private wheelFlg = false;
	private downFlg = false;
	private moveFlg = false;
	private keyDownFlg = false;
	private dblClickFlg = false;

	constructor() {}

	_emitData($clientX: number, $clientY: number): void {
		this.dataSet.emit({
			x: $clientX,
			y: $clientY,
			delta: this.delta,
			btn: this.btn,
			wheelFlg: this.wheelFlg,
			downFlg: this.downFlg,
			moveFlg: this.moveFlg,
			dblClickFlg: this.dblClickFlg
		});
	}

	_resetAllFlgs(): void {
		this.downFlg = false;
		this.moveFlg = false;
		this.keyDownFlg = false;
		this.dblClickFlg = false;
	}

	// Window unload listener
	@HostListener('window:unload', ['$event']) onUnload($e): void {
		// console.log($e.returnValue);
		// $e.returnValue = true;

		this.isUnload.emit($e);
	}

	// Window unload listener
	@HostListener('window:beforeunload', ['$event']) onBeforeUnload($e): void {
		// console.log($e.returnValue);
		// $e.returnValue = true;

		this.isUnload.emit($e);
	}

	// Keydown listener
	@HostListener('document:keydown', ['$event']) onKeyDown($e): void {
		this.keyDownFlg = true;
		this.key.emit({
			key: $e.key,
			type: $e.type,
			e: $e,
			x: this.clientX,
			y: this.clientY,
			keyDownFlg: this.keyDownFlg,
			downFlg: this.downFlg,
			moveFlg: this.moveFlg
		});
	}

	// Keyup listener
	@HostListener('document:keyup', ['$event']) onKeyUp($e): void {
		this.keyDownFlg = false;
		this.key.emit({
			key: $e.key,
			type: $e.type,
			e: $e,
			x: this.clientX,
			y: this.clientY,
			keyDownFlg: this.keyDownFlg,
			downFlg: this.downFlg,
			moveFlg: this.moveFlg
		});
	}

	// Pointerdown listener
	@HostListener('pointerdown', ['$event']) onPointerDown($e): void {
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

	// Mousemove listener
	@HostListener('dblclick', ['$event']) onDoubleClick($e): void {
		const clientX = $e.clientX;
		const clientY = $e.clientY;

		// Initialize flags
		this._resetAllFlgs();
		this.dblClickFlg = true;
		this._emitData(clientX, clientY);

		// To prevent permanent zooming
		this.dblClickFlg = false;
	}

	// Wheel listener
	@HostListener('wheel', ['$event']) onMouseWheel($e): void {
		$e.preventDefault();

		const clientX = $e.clientX;
		const clientY = $e.clientY;

		this.wheelFlg = true;
		this.delta = $e.deltaY;
		this._emitData(clientX, clientY);
		// To prevent permanent zooming
		this.wheelFlg = false;
	}

	// Contextmenu listener
	@HostListener('document:contextmenu', ['$event']) onContextMenu($e): void {
		$e.preventDefault();
	}

	// Down event
	_onDown($e: any): void {
		let clientX: number;
		let clientY: number;

		if ($e.type === 'touchstart') {
			clientX = $e.touches[0].clientX;
			clientY = $e.touches[0].clientY;
			this.btn = 0;
		} else {
			clientX = $e.clientX;
			clientY = $e.clientY;
			this.btn = $e.button;
		}

		this.clientX = clientX;
		this.clientY = clientY;

		// Initialize flags
		this._resetAllFlgs();
		this.downFlg = true;
		this._emitData(clientX, clientY);
	}

	// Up event
	_onUp($e: any): void {
		let clientX: number;
		let clientY: number;

		if ($e.type === 'touchend') {
			clientX = $e.changedTouches[0].clientX;
			clientY = $e.changedTouches[0].clientY;
		} else {
			clientX = $e.clientX;
			clientY = $e.clientY;
		}

		this.clientX = clientX;
		this.clientY = clientY;

		// Initialize flags
		this._resetAllFlgs();
		this._emitData(clientX, clientY);
	}

	// Move event
	_onMove($e: any): void {
		let clientX: number;
		let clientY: number;

		if ($e.type === 'touchmove') {
			clientX = $e.touches[0].clientX;
			clientY = $e.touches[0].clientY;
		} else {
			clientX = $e.clientX;
			clientY = $e.clientY;
		}

		this.clientX = clientX;
		this.clientY = clientY;

		this.moveFlg = true;
		this._emitData(clientX, clientY);
	}
}
