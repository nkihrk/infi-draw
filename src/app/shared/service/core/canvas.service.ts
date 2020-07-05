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
    const history: History = this.memory.history;
    // To sync canvas offsets with dataList
    history.canvasOffsets.prevOffsetX = history.canvasOffsets.newOffsetX;
    history.canvasOffsets.prevOffsetY = history.canvasOffsets.newOffsetY;
  }

  registerOnNoMouseDown($event: PointerEvent): void {
    this.updateOffsets(0, 0, $event);
  }

  registerOnMouseMiddleMove($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
    this.updateOffsets($newOffsetX, $newOffsetY, $event);
  }

  updateOffsets($newOffsetX: number, $newOffsetY: number, $event?: PointerEvent): void {
    this.coord.updateOffsets($newOffsetX, $newOffsetY, this.memory.history.canvasOffsets, $event);
    this.memory.history.canvasOffsets.zoomRatio = this.coord.updateZoomRatioByWheel(
      this.memory.history.canvasOffsets.zoomRatio,
      $event
    );
  }
}
