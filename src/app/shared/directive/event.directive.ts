import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { Key } from '../model/key.model';
import { PointerEvent } from '../model/pointer-event.model';

@Directive({
  selector: '[appEvent]'
})
export class EventDirective {
  @Output() dataSet = new EventEmitter<PointerEvent>();
  @Output() key = new EventEmitter<Key>();
  @Output() isUnload = new EventEmitter<any>();

  private eCache: any[] = [];
  private prevDiff = -1;

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

  _emitData($clientX: number, $clientY: number) {
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

  _resetAllFlgs() {
    this.downFlg = false;
    this.moveFlg = false;
    this.keyDownFlg = false;
    this.dblClickFlg = false;
  }

  // Window unload listener
  @HostListener('window:unload', ['$event']) onUnload($e) {
    // console.log($e.returnValue);
    // $e.returnValue = true;

    this.isUnload.emit($e);
  }

  // Window unload listener
  @HostListener('window:beforeunload', ['$event']) onBeforeUnload($e) {
    // console.log($e.returnValue);
    // $e.returnValue = true;

    this.isUnload.emit($e);
  }

  // Dragover listener
  @HostListener('document:dragover', ['$event']) onDragOver($e) {
    $e.preventDefault();
    $e.stopPropagation();
  }

  // Dragleave listener
  @HostListener('document:dragleave', ['$event']) onDragLeave($e) {
    $e.preventDefault();
    $e.stopPropagation();
  }

  // Drop listener
  @HostListener('document:drop', ['$event']) onDrop($e: DragEvent) {
    $e.preventDefault();
    $e.stopPropagation();
  }

  // Paste listener
  @HostListener('document:paste', ['$event']) onPaste($e: ClipboardEvent) {
    $e.preventDefault();
    $e.stopPropagation();
  }

  // Keydown listener
  @HostListener('document:keydown', ['$event']) onKeyDown($e) {
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
  @HostListener('document:keyup', ['$event']) onKeyUp($e) {
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
  @HostListener('document:pointerdown', ['$event']) onPointerDown($e) {
    $e.preventDefault();
    $e.stopPropagation();
    this.eCache.push($e);
    this._onDown($e);
  }

  // Pointerup listener
  @HostListener('document:pointerup', ['$event']) onPointerUp($e) {
    $e.preventDefault();
    $e.stopPropagation();

    const eCache = this.eCache;
    for (let i = 0; i < eCache.length; i++) {
      if (eCache[i].pointerId === $e.pointerId) {
        eCache.splice(i, 1);
        break;
      }
    }

    if (eCache.length < 2) {
      this.prevDiff = -1;
    }

    this._onUp($e);
  }

  // Pointermove listener
  @HostListener('document:pointermove', ['$event']) onPointerMove($e) {
    $e.preventDefault();
    $e.stopPropagation();

    this._onMove($e);
  }

  // Touchstart listener
  @HostListener('document:touchstart', ['$event']) onTouchStart($e) {
    // $e.preventDefault();
    $e.stopPropagation();
    this._onDown($e);
  }

  // Touchend listener
  @HostListener('document:touchend', ['$event']) onTouchEnd($e) {
    // $e.preventDefault();
    $e.stopPropagation();
    this._onUp($e);
  }

  // Touchmove listener
  @HostListener('document:touchmove', ['$event']) onTouchMove($e) {
    // $e.preventDefault();
    $e.stopPropagation();
    this._onMove($e);
  }

  // Mousedown listener
  @HostListener('document:mousedown', ['$event']) onMouseDown($e) {
    $e.preventDefault();
    $e.stopPropagation();
    this._onDown($e);
  }

  // Mouseup listener
  @HostListener('document:mouseup', ['$event']) onMouseUp($e) {
    $e.preventDefault();
    $e.stopPropagation();
    this._onUp($e);
  }

  // Mouseleave listener
  @HostListener('document:mouseleave', ['$event']) onMouseLeave($e) {}

  // Mousemove listener
  @HostListener('document:mousemove', ['$event']) onMouseMove($e) {
    $e.preventDefault();
    $e.stopPropagation();
    this._onMove($e);
  }

  // Mousemove listener
  @HostListener('document:dblclick', ['$event']) onDoubleClick($e) {
    $e.preventDefault();
    $e.stopPropagation();

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
  @HostListener('document:wheel', ['$event']) onMouseWheel($e) {
    $e.stopPropagation();

    const clientX = $e.clientX;
    const clientY = $e.clientY;

    this.wheelFlg = true;
    this.delta = $e.deltaY;
    this._emitData(clientX, clientY);
    // To prevent permanent zooming
    this.wheelFlg = false;
  }

  // Contextmenu listener
  @HostListener('document:contextmenu', ['$event']) onContextMenu($e) {
    $e.preventDefault();
    $e.stopPropagation();
  }

  // Down event
  _onDown($e: any) {
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
  _onUp($e: any) {
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
  _onMove($e: any) {
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
