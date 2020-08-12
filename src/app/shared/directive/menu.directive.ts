import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appMenu]'
})
export class MenuDirective {
  @Output() isHover = new EventEmitter<boolean>();
  @Output() isPointerUp = new EventEmitter<boolean>();

  constructor() { }

  // Pointerover listener
  @HostListener('pointerover', ['$event']) onPointerOver($e): void {
    this.isHover.emit(true);
  }

  // Pointerup listener
  @HostListener('document:pointerup', ['$event']) onPointerUp($e): void {
    this.isPointerUp.emit(true);
  }

  // Touchend listener
  @HostListener('document:touchend', ['$event']) onTouchEnd($e): void {
    this.isPointerUp.emit(true);
  }

  // Mouseup listener
  @HostListener('document:mouseup', ['$event']) onMouseUp($e): void {
    this.isPointerUp.emit(true);
  }
}
