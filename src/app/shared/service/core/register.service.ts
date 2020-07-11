import { Injectable } from '@angular/core';
import { PointerEvent } from '../../model/pointer-event.model';
import { CanvasService } from './canvas.service';
import { MemoryService } from './memory.service';
import { DrawService } from './draw.service';
import { EraseService } from './erase.service';
import { Flgs } from '../../model/flgs.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(
    private memory: MemoryService,
    private canvas: CanvasService,
    private drawFunc: DrawService,
    private eraseFunc: EraseService
  ) {}

  onMouseDown(): void {
    this.canvas.registerOnMouseDown();
    this.drawFunc.registerOnMouseDown();
  }

  onNoMouseDown($event: PointerEvent): void {
    const flgs: Flgs = this.memory.flgs;

    this.canvas.registerOnMouseDown();
    this.drawFunc.registerOnMouseDown();

    // Wheel event - zooming-in/out
    if (flgs.wheelFlg) {
      this.canvas.registerOnNoMouseDown($event);
      this.drawFunc.registerOnNoMouseDown($event);
    }
  }

  onMouseUp(): void {
    const flgs: Flgs = this.memory.flgs;

    if (flgs.leftUpFlg) {
    } else if (flgs.rightUpFlg) {
    } else if (flgs.middleUpFlg) {
    }
  }

  onMouseMove($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
    const reserved = this.memory.reservedByFunc;
    const flgs: Flgs = this.memory.flgs;

    if (flgs.leftDownMoveFlg) {
      if (reserved.name === 'draw') {
        this.drawFunc.recordTrail();
      } else if (reserved.name === 'erase') {
        this.eraseFunc.setVisibility();
      }
    } else if (flgs.middleDownMoveFlg) {
      // Update canvas coordinates
      this.canvas.registerOnMouseMiddleMove($newOffsetX, $newOffsetY, $event);
      // Update trail point coordinates
      this.drawFunc.registerOnMouseMiddleMove($newOffsetX, $newOffsetY, $event);
    }
  }
}
