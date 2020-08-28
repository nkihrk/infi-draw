import { Injectable } from '@angular/core';
import { Pointer } from '../../model/pointer.model';
import { CoordService } from '../util/coord.service';
import { MemoryService } from '../../service/core/memory.service';
import { Offset } from '../../model/offset.model';

@Injectable({
	providedIn: 'root'
})
export class CanvasService {
	constructor(private memory: MemoryService, private coord: CoordService) {}

	registerOnMouseDown(): void {
		this.memory.canvasOffset.prevOffsetX = this.memory.canvasOffset.newOffsetX;
		this.memory.canvasOffset.prevOffsetY = this.memory.canvasOffset.newOffsetY;
	}

	registerOnNoMouseDown(): void {
		this.registerOnMouseDown();
	}

	registerOnWheel($event: Pointer): void {
		this._updateOffset(0, 0, $event);
	}

	registerOnMouseMiddleMove($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		this._updateOffset($newOffsetX, $newOffsetY, $event);
	}

	private _updateOffset($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		const offset: Offset = this.coord.updateOffset($newOffsetX, $newOffsetY, this.memory.canvasOffset, $event);
		let zoomRatio: number = this.memory.canvasOffset.zoomRatio;

		if (this.memory.flgs.wheelFlg) {
			zoomRatio = this.coord.updateZoomRatioByWheel(this.memory.canvasOffset.zoomRatio, $event);
		}

		this.memory.canvasOffset = { ...offset, zoomRatio };
	}

	updateOffsetByZoom($x: number, $y: number, $deltaFlg: boolean): void {
		// Update prevOffsets
		this.registerOnNoMouseDown();

		const offset: Offset = this.coord.updateOffsetWithGivenPoint($x, $y, this.memory.canvasOffset, $deltaFlg);
		const zoomRatio: number = this.coord.updateZoomRatioByPointer(this.memory.canvasOffset.zoomRatio, $deltaFlg);

		this.memory.canvasOffset = { ...offset, zoomRatio };
	}
}
