import { Injectable } from '@angular/core';
import { History } from '../../model/history.model';
import { PointerEvent } from '../../model/pointer-event.model';
import { CoordService } from '../util/coord.service';
import { MemoryService } from '../../service/core/memory.service';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  constructor(private memory: MemoryService, private coord: CoordService) {}

  registerOnMouseDown(): void {
    this.memory.canvasOffsets.prevOffsetX = this.memory.canvasOffsets.newOffsetX;
    this.memory.canvasOffsets.prevOffsetY = this.memory.canvasOffsets.newOffsetY;
  }

  registerOnNoMouseDown($event: PointerEvent): void {
    this.updateOffsets(0, 0, $event);
  }

  registerOnMouseMiddleMove($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
    this.updateOffsets($newOffsetX, $newOffsetY, $event);
  }

  updateOffsets($newOffsetX: number, $newOffsetY: number, $event?: PointerEvent): void {
    this.coord.updateOffsets($newOffsetX, $newOffsetY, this.memory.canvasOffsets, $event);
    this.memory.canvasOffsets.zoomRatio = this.coord.updateZoomRatioByWheel(
      this.memory.canvasOffsets.zoomRatio,
      $event
    );
  }
}
