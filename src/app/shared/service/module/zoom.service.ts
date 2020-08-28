import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { CoordService } from '../util/coord.service';
import { CanvasService } from '../core/canvas.service';
import { DrawService } from '../module/draw.service';

@Injectable({
	providedIn: 'root'
})
export class ZoomService {
	constructor(
		private memory: MemoryService,
		private coord: CoordService,
		private canvas: CanvasService,
		private draw: DrawService
	) {}

	activate($toggleFlg: boolean): void {
		if ($toggleFlg) {
			this.memory.reservedByFunc.current = {
				name: 'zoom',
				type: '',
				group: ''
			};
		} else {
			this.memory.reservedByFunc.current = this.memory.reservedByFunc.prev;
		}
	}

	updateOffsets($newOffsetX: number, $newOffsetY: number): void {
		const x: number = this.memory.renderer.canvasWrapper.getBoundingClientRect().width / 2;
		const y: number = this.memory.renderer.canvasWrapper.getBoundingClientRect().height / 2;

		if ($newOffsetX > 0) {
			this.canvas.updateOffsetByZoom(x, y, true);
			this.draw.updateOffsetsByZoom(x, y, true);
		} else {
			this.canvas.updateOffsetByZoom(x, y, false);
			this.draw.updateOffsetsByZoom(x, y, false);
		}
	}
}
