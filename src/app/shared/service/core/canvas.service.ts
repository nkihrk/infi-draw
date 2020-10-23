import { Injectable } from '@angular/core';
import { Pointer } from '../../model/pointer.model';
import { CoordService } from '../util/coord.service';
import { MemoryService } from '../../service/core/memory.service';
import { Offset } from '../../model/offset.model';

import { Store } from '@ngrx/store';
// NgRx - actions
import {
	updateCanvasOffset,
	updateCanvasOffsetNewOffset,
	updateCanvasOffsetNewOffsetNoRestrict,
	updateCanvasOffsetPrevOffset,
	updateCanvasOffsetZoomRatioByWheel,
	updateCanvasOffsetZoomRatioByPointer
} from '../../../actions/canvas-offset.actions';

@Injectable({
	providedIn: 'root'
})
export class CanvasService {
	constructor(private memory: MemoryService, private coord: CoordService, private store: Store) {}

	registerOnMouseDown(): void {
		this.store.dispatch(updateCanvasOffsetPrevOffset());
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
		if (this.memory.flgs.wheelFlg) {
			this.store.dispatch(
				updateCanvasOffsetZoomRatioByWheel({
					deltaFlg: $event.delta > 0,
					zoomSpeed: this.memory.constant.WHEEL_ZOOM_SPEED
				})
			);
		}

		const data = {
			newOffsetX: $newOffsetX,
			newOffsetY: $newOffsetY,
			event: $event,
			pointerOffset: this.memory.pointerOffset,
			states: this.memory.states,
			wheelFlg: this.memory.flgs.wheelFlg,
			zoomSpeed: this.memory.constant.WHEEL_ZOOM_SPEED
		};
		this.store.dispatch(updateCanvasOffsetNewOffset(data));
	}

	updateOffsetByZoom($x: number, $y: number, $deltaFlg: boolean): void {
		// Update prevOffsets
		this.registerOnNoMouseDown();

		this.store.dispatch(
			updateCanvasOffsetNewOffsetNoRestrict({
				x: $x,
				y: $y,
				deltaFlg: $deltaFlg,
				zoomSpeed: this.memory.constant.WHEEL_ZOOM_SPEED
			})
		);
		this.store.dispatch(
			updateCanvasOffsetZoomRatioByPointer({ deltaFlg: $deltaFlg, zoomSpeed: this.memory.constant.WHEEL_ZOOM_SPEED })
		);
	}
}
