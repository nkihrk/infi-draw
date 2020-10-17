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
	private count = 0;

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

	private _keyDownFuncs($e: Key): void {
		const keymap: any = this.keymap.keyMap;

		// Save a previous state once
		if (this.count === 0) {
			this.memory.reservedByFunc.prev = this.memory.reservedByFunc.current;
		}
		this.count++;

		if (keymap.Control) {
			if (keymap.Shift) {
				if (keymap.z || keymap.Z) {
					this._redo($e);
				}
			} else {
				if (keymap.a) {
					this._selectAll($e);
				} else if (keymap.z) {
					this._undo($e);
				} else if (keymap[' ']) {
					this._zoom($e);
				}
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
			} else if (keymap.v) {
				this._select($e);
			}
		}
	}

	private _keyUpFuncs($e: Key): void {
		switch (this.whichFunc) {
			case 'select':
				this.func.select();
				break;

			case 'pen':
				this.func.pen();
				break;

			case 'eraser':
				this.func.eraser();
				break;

			case 'hand':
				this.func.hand();
				break;

			case 'zoom':
				this.func.zoom(false);
				break;

			default:
				break;
		}

		// Initialize
		this.whichFunc = '';
		this.count = 0;
	}

	private _pen($e: Key): void {
		this.whichFunc = 'pen';
	}

	private _eraser($e: Key): void {
		this.whichFunc = 'eraser';
	}

	private _hand($e: Key): void {
		this.whichFunc = 'hand';
	}

	private _select($e: Key): void {
		this.whichFunc = 'select';
	}

	private _selectAll($e: Key): void {
		$e.e.preventDefault();

		this.whichFunc = 'select-all';
		this.func.selectAll();
	}

	private _redo($e: Key): void {
		$e.e.preventDefault();

		this.whichFunc = 'redo';
		this.func.redo();
	}

	private _undo($e: Key): void {
		$e.e.preventDefault();

		this.whichFunc = 'undo';
		this.func.undo();
	}

	private _zoom($e: Key): void {
		this.whichFunc = 'zoom';
		this.func.zoom(true);
	}
}
