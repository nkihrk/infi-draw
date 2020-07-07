import { Injectable } from '@angular/core';
import { PointerEvent } from '../../model/pointer-event.model';
import { CoordService } from '../util/coord.service';
import { MemoryService } from '../../service/core/memory.service';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  constructor(private memory: MemoryService, private coord: CoordService) {}

  registerOnMouseDown(): void {
    this.memory.canvasOffset.prevOffsetX = this.memory.canvasOffset.newOffsetX;
    this.memory.canvasOffset.prevOffsetY = this.memory.canvasOffset.newOffsetY;
  }

  registerOnNoMouseDown($event: PointerEvent): void {
    this.updateOffsets(0, 0, $event);
  }

  registerOnMouseMiddleMove($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
    this.updateOffsets($newOffsetX, $newOffsetY, $event);
  }

  updateOffsets($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
    this.coord.updateOffsets($newOffsetX, $newOffsetY, this.memory.canvasOffset, $event);
    this.memory.canvasOffset.zoomRatio = this.coord.updateZoomRatioByWheel(this.memory.canvasOffset.zoomRatio, $event);
  }
}
