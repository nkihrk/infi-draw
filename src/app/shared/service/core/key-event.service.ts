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
      this._keyDownFunctions($e);
    } else if ($e.type === 'keyup') {
      this._keyUpFunctions($e);
      this.keymap.keyUpEvent($e);
    }
  }

  _keyDownFunctions($e: Key): void {
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
      if (keymap.p) {
        this._draw($e);
      }
    }
  }

  _keyUpFunctions($e: Key): void {
    switch (this.whichFunc) {
      default:
        break;
    }

    // Initialize
    this.whichFunc = '';
  }

  _draw($e: Key): void {
    $e.e.preventDefault();
    $e.e.stopPropagation();
    if (this.whichFunc !== 'draw') this._keyUpFunctions($e);

    this.whichFunc = 'draw';
    this.func.draw();
  }

  _undo($e: Key): void {
    $e.e.preventDefault();
    $e.e.stopPropagation();
    if (this.whichFunc !== 'undo') this._keyUpFunctions($e);

    this.whichFunc = 'undo';
    this.func.undo();
  }

  _redo($e: Key): void {
    $e.e.preventDefault();
    $e.e.stopPropagation();
    if (this.whichFunc !== 'redo') this._keyUpFunctions($e);

    this.whichFunc = 'redo';
    this.func.redo();
  }
}
