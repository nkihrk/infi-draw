import { Injectable } from '@angular/core';
import { PointerEvent } from '../../model/pointer-event.model';
import { CanvasService } from './canvas.service';
import { MemoryService } from './memory.service';
import {DrawService} from './draw.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private memory: MemoryService, private canvas: CanvasService, private drawFunc: DrawService) {}

  onMouseDown(): void {
    this.canvas.registerOnMouseDown();
  }

  onNoMouseDown($event: PointerEvent): void {
    this.canvas.registerOnMouseDown();
    // Wheel event - zooming-in/out
    if (this.memory.flgs.wheelFlg) {
      this.canvas.registerOnNoMouseDown($event);
    }
  }

  onMouseUp(): void {
    if (this.memory.flgs.leftUpFlg) {
    } else if (this.memory.flgs.rightUpFlg) {
    } else if (this.memory.flgs.middleUpFlg) {
    }
  }

  onMouseMove($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
    if (this.memory.flgs.leftDownMoveFlg) {
      if (this.memory.reservedByFunc.name === 'draw') {
        this.drawFunc.recordTrail();
      }
    } else if (this.memory.flgs.middleDownMoveFlg) {
      // Update canvas coordinates
      this.canvas.registerOnMouseMiddleMove($newOffsetX, $newOffsetY, $event);
    }
  }
}
