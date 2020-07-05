import { Injectable } from '@angular/core';
import { Key } from '../../model/key.model';

@Injectable({
  providedIn: 'root'
})
export class KeyMapService {
  public keyMap: any = {};

  constructor() {}

  keyDownEvent($e: Key) {
    this.keyMap[$e.key] = true;

    const isCtrlKey: boolean = this.keyMap.Control;
    const isAltKey: boolean = this.keyMap.Alt;
    const isShiftKey: boolean = this.keyMap.Shift;

    const isZkey: boolean = this.keyMap.z; // Undo and redo

    const isPermitkey: boolean = isCtrlKey || isAltKey || isShiftKey || isZkey;
    if (!isPermitkey) this.keyMap = {};
  }

  keyUpEvent($e: Key) {
    if ($e.key === 'Control') this.keyMap.Control = false;
    if ($e.key === 'Alt') this.keyMap.Alt = false;
    if ($e.key === 'Shift') this.keyMap.Shift = false;
    if ($e.key === 'Enter') this.keyMap.Enter = false;
    this._initKeyMap();
  }

  _initKeyMap() {
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
