import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { Key } from '../../model/key.model';

@Injectable({
	providedIn: 'root'
})
export class KeyMapService {
	public keyMap: any = {};

	constructor(private memory: MemoryService) {}

	keyDownEvent($e: Key): void {
		this.keyMap[$e.key] = true;

		const isCtrlKey: boolean = this.keyMap.Control;
		const isAltKey: boolean = this.keyMap.Alt;
		const isShiftKey: boolean = this.keyMap.Shift;
		const isSpaceKey: boolean = this.keyMap[' '];

		const isAkey: boolean = this.keyMap.a; // Select all
		const isEkey: boolean = this.keyMap.e; // Erase
		const isHkey: boolean = this.keyMap.h; // Hand
		const isPkey: boolean = this.keyMap.p; // Draw
		const isVkey: boolean = this.keyMap.v; // Select
		const isZkey: boolean = this.keyMap.z; // Undo and redo

		const isPermitkey: boolean =
			isCtrlKey || isAltKey || isShiftKey || isSpaceKey || isAkey || isEkey || isHkey || isPkey || isVkey || isZkey;
		if (!isPermitkey) this.keyMap = {};

		this.memory.keyMap = this.keyMap;
	}

	keyUpEvent($e: Key): void {
		if ($e.key === 'Control') this.keyMap.Control = false;
		if ($e.key === 'Alt') this.keyMap.Alt = false;
		if ($e.key === 'Shift') this.keyMap.Shift = false;
		this._initKeyMap();
	}

	_initKeyMap(): void {
		if (this.keyMap.Control) {
			if (this.keyMap.Shift) {
				this.keyMap = {};
				this.keyMap.Control = true;
				this.keyMap.Shift = true;
			} else {
				this.keyMap = {};
				this.keyMap.Control = true;
			}
		} else if (this.keyMap.Alt) {
			this.keyMap = {};
			this.keyMap.Alt = true;
		} else if (this.keyMap.Shift) {
			this.keyMap = {};
			this.keyMap.Shift = true;
		} else {
			this.keyMap = {};
		}
	}
}
