import { Injectable } from '@angular/core';
import { Pointer } from '../../model/pointer.model';
import { MemoryService } from '../core/memory.service';
import { Offset } from '../../model/offset.model';

@Injectable({
	providedIn: 'root'
})
export class CoordService {
	constructor(private memory: MemoryService) {}

	updateOffset($newOffsetX: number, $newOffsetY: number, $offset: Offset, $event: Pointer): Offset {
		let offsetX: number = $offset.prevOffsetX;
		let offsetY: number = $offset.prevOffsetY;

		if (!this.memory.flgs.wheelFlg) {
			if (
				($event.btn === 0 && !this.memory.states.isPreventSelect) ||
				($event.btn === 1 && !this.memory.states.isPreventTrans)
			) {
				offsetX += $newOffsetX;
				offsetY += $newOffsetY;
			}
		} else {
			offsetX -= this.memory.pointerOffset.current.x;
			offsetY -= this.memory.pointerOffset.current.y;

			if ($event.delta > 0) {
				const ratio: number = 1 - this.memory.constant.WHEEL_ZOOM_SPEED;
				offsetX = offsetX * ratio + this.memory.pointerOffset.current.x;
				offsetY = offsetY * ratio + this.memory.pointerOffset.current.y;
			} else {
				const ratio: number = 1 + this.memory.constant.WHEEL_ZOOM_SPEED;
				offsetX = offsetX * ratio + this.memory.pointerOffset.current.x;
				offsetY = offsetY * ratio + this.memory.pointerOffset.current.y;
			}
		}

		$offset.newOffsetX = offsetX;
		$offset.newOffsetY = offsetY;

		return $offset;
	}

	updateOffsetWithGivenPoint($x: number, $y: number, $offset: Offset, $deltaFlg: boolean): Offset {
		let offsetX: number = $offset.prevOffsetX;
		let offsetY: number = $offset.prevOffsetY;

		offsetX -= $x;
		offsetY -= $y;

		if ($deltaFlg) {
			const ratio: number = 1 - this.memory.constant.POINTER_ZOOM_SPEED;
			offsetX = offsetX * ratio + $x;
			offsetY = offsetY * ratio + $y;
		} else {
			const ratio: number = 1 + this.memory.constant.POINTER_ZOOM_SPEED;
			offsetX = offsetX * ratio + $x;
			offsetY = offsetY * ratio + $y;
		}

		$offset.newOffsetX = offsetX;
		$offset.newOffsetY = offsetY;

		return $offset;
	}

	updateZoomRatioByWheel($zoomRatio: number, $event: Pointer): number {
		let zoomRatio: number = $zoomRatio;

		let ratio = 1;
		if ($event.delta > 0) {
			// Negative zoom
			ratio -= this.memory.constant.WHEEL_ZOOM_SPEED;
		} else {
			// Positive zoom
			ratio += this.memory.constant.WHEEL_ZOOM_SPEED;
		}

		zoomRatio *= ratio;

		return zoomRatio;
	}

	updateZoomRatioByPointer($zoomRatio: number, $deltaFlg: boolean): number {
		let zoomRatio: number = $zoomRatio;

		let ratio = 1;
		if ($deltaFlg) {
			// Negative zoom
			ratio -= this.memory.constant.POINTER_ZOOM_SPEED;
		} else {
			// Positive zoom
			ratio += this.memory.constant.POINTER_ZOOM_SPEED;
		}

		zoomRatio *= ratio;

		return zoomRatio;
	}
}
