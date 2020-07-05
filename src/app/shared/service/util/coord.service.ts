import { Injectable } from '@angular/core';
import { PointerEvent } from '../../model/pointer-event.model';
import { MemoryService } from '../core/memory.service';

@Injectable({
  providedIn: 'root'
})
export class CoordService {
  constructor(private memory: MemoryService) {}

  updateOffsetsNoRistrict($newOffsetX, $newOffsetY, $offsets: any, $event: PointerEvent): void {
    const offsets = $offsets;
    let offsetX: number = offsets.prevOffsetX;
    let offsetY: number = offsets.prevOffsetY;

    if (!this.memory.flgs.wheelFlg) {
      if ($event.btn === 0 || $event.btn === 1) {
        offsetX += $newOffsetX;
        offsetY += $newOffsetY;
      }
    } else {
      offsetX -= this.memory.mousePos.x;
      offsetY -= this.memory.mousePos.y;

      if ($event.delta > 0) {
        const ratio: number = 1 - this.memory.constant.ZOOM_SPEED;
        offsetX = offsetX * ratio + this.memory.mousePos.x;
        offsetY = offsetY * ratio + this.memory.mousePos.y;
      } else {
        const ratio: number = 1 + this.memory.constant.ZOOM_SPEED;
        offsetX = offsetX * ratio + this.memory.mousePos.x;
        offsetY = offsetY * ratio + this.memory.mousePos.y;
      }
    }

    offsets.newOffsetX = offsetX;
    offsets.newOffsetY = offsetY;
  }

  updateOffsets($newOffsetX, $newOffsetY, $offsets: any, $event: PointerEvent): void {
    const offsets = $offsets;
    let offsetX: number = offsets.prevOffsetX;
    let offsetY: number = offsets.prevOffsetY;

    if (!this.memory.flgs.wheelFlg) {
      if (
        ($event.btn === 0 && !this.memory.states.isPreventSelect) ||
        ($event.btn === 1 && !this.memory.states.isPreventWholeTrans)
      ) {
        offsetX += $newOffsetX;
        offsetY += $newOffsetY;
      }
    } else {
      if (!this.memory.states.isPreventWheel) {
        offsetX -= this.memory.mousePos.x;
        offsetY -= this.memory.mousePos.y;

        if ($event.delta > 0) {
          const ratio: number = 1 - this.memory.constant.ZOOM_SPEED;
          offsetX = offsetX * ratio + this.memory.mousePos.x;
          offsetY = offsetY * ratio + this.memory.mousePos.y;
        } else {
          const ratio: number = 1 + this.memory.constant.ZOOM_SPEED;
          offsetX = offsetX * ratio + this.memory.mousePos.x;
          offsetY = offsetY * ratio + this.memory.mousePos.y;
        }
      }
    }

    offsets.newOffsetX = offsetX;
    offsets.newOffsetY = offsetY;
  }

  updateSizeByPointer($size: any, $newOffsetX, $newOffsetY): void {
    const size = $size;
    size.width += $newOffsetX;
    size.height += $newOffsetY;
  }

  updateSizeByWheel($size: any, $event: PointerEvent): void {
    const size = $size;
    let width: number = size.width;
    let height: number = size.height;

    if (this.memory.flgs.wheelFlg && !this.memory.states.isPreventWheel) {
      let ratio = 1;
      if ($event.delta > 0) {
        // Negative zoom
        ratio -= this.memory.constant.ZOOM_SPEED;
      } else {
        // Positive zoom
        ratio += this.memory.constant.ZOOM_SPEED;
      }

      width *= ratio;
      height *= ratio;

      size.width = width;
      size.height = height;
    }
  }

  updateZoomRatioByWheel($zoomRatio: number, $event: PointerEvent): number {
    let zoomRatio: number = $zoomRatio;

    if (this.memory.flgs.wheelFlg && !this.memory.states.isPreventWheel) {
      let ratio = 1;
      if ($event.delta > 0) {
        // Negative zoom
        ratio -= this.memory.constant.ZOOM_SPEED;
      } else {
        // Positive zoom
        ratio += this.memory.constant.ZOOM_SPEED;
      }

      zoomRatio *= ratio;
    }

    return zoomRatio;
  }
}
