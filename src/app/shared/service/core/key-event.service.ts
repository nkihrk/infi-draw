import { Injectable } from '@angular/core';
import { Key } from '../../model/key.model';
import { FuncService } from './func.service';
import { KeyMapService } from './key-map.service';
import { MemoryService } from './memory.service';

@Injectable({
	providedIn: 'root'
})
export class KeyEventService {
	private whichFunc = '';

	constructor(private keymap: KeyMapService, private func: FuncService, private memory: MemoryService) {}

	onKeyEvents($e: Key): void {
		if ($e.type === 'keydown') {
			this.keymap.keyDownEvent($e);
			this._keyDownFuncs($e);
		} else if ($e.type === 'keyup') {
			this._keyUpFuncs($e);
			this.keymap.keyUpEvent($e);
		}
	}

	_keyDownFuncs($e: Key): void {
		const keymap: any = this.keymap.keyMap;

		if (keymap.Control) {
			if (keymap.Shift) {
				if (keymap.z || keymap.Z) {
					this._redo($e);
				}
			} else if (keymap.z) {
				this._undo($e);
			}
		} else if (keymap.Shift) {
			if (keymap.Control) {
				if (keymap.z || keymap.Z) {
					this._redo($e);
				}
			}
		} else {
			if (keymap.e) {
				this._eraser($e);
			} else if (keymap.p) {
				this._pen($e);
			} else if (keymap.h) {
				this._hand($e);
			}
		}
	}

	_keyUpFuncs($e: Key): void {
		switch (this.whichFunc) {
			case 'pen':
				this.func.pen();
				break;

			case 'eraser':
				this.func.eraser();
				break;

			case 'hand':
				this.func.hand();
				break;

			default:
				break;
		}

		// Initialize
		this.whichFunc = '';
	}

	_pen($e: Key): void {
		if (this.whichFunc !== 'pen') this._keyUpFuncs($e);

		this.whichFunc = 'pen';
	}

	_eraser($e: Key): void {
		if (this.whichFunc !== 'eraser') this._keyUpFuncs($e);

		this.whichFunc = 'eraser';
	}

	_hand($e: Key): void {
		if (this.whichFunc !== 'hand') this._keyUpFuncs($e);

		this.whichFunc = 'hand';
	}
	_redo($e: Key): void {
		$e.e.preventDefault();
		if (this.whichFunc !== 'redo') this._keyUpFuncs($e);

		this.whichFunc = 'redo';
		this.func.redo();
	}

	_undo($e: Key): void {
		$e.e.preventDefault();
		if (this.whichFunc !== 'undo') this._keyUpFuncs($e);

		this.whichFunc = 'undo';
		this.func.undo();
	}
}
