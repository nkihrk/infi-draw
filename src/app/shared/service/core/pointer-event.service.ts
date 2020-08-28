import { Injectable } from '@angular/core';
import { Pointer } from '../../model/pointer.model';
import { Flgs } from '../../model/flgs.model';
import { CanvasService } from './canvas.service';

// Modules
import { DrawService } from '../module/draw.service';
import { EraseService } from '../module/erase.service';
import { ZoomService } from '../module/zoom.service';

@Injectable({
	providedIn: 'root'
})
export class PointerEventService {
	constructor(
		private canvas: CanvasService,
		private drawFunc: DrawService,
		private eraseFunc: EraseService,
		private zoomFunc: ZoomService
	) {}

	down(): void {
		this.canvas.registerOnMouseDown();
		this.drawFunc.registerOnMouseDown();
	}

	noDown(): void {
		this.canvas.registerOnNoMouseDown();
		this.drawFunc.registerOnNoMouseDown();
	}

	wheel($event: Pointer): void {
		this.canvas.registerOnWheel($event);
		this.drawFunc.registerOnWheel($event);
	}

	leftUp(): void {}

	rightUp(): void {}

	middleUp(): void {}

	leftDownMove($type: string, $name: string, $newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		switch ($type) {
			case 'draw':
				this.drawFunc.registerDrawFuncs($newOffsetX, $newOffsetY);
				break;

			case 'erase':
				this.eraseFunc.setVisibility();
				break;

			default:
				if ($name === 'hand') {
					this._updateCanvases($newOffsetX, $newOffsetY, $event);
				} else if ($name === 'zoom') {
					this.zoomFunc.updateOffsets($newOffsetX, $newOffsetY);
				}
				break;
		}
	}

	rightDownMove($type: string, $newOffsetX: number, $newOffsetY: number, $event: Pointer): void {}

	middleDownMove($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		this._updateCanvases($newOffsetX, $newOffsetY, $event);
	}

	//////////////////////////////////////////////////////////
	//
	// Private methods
	//
	//////////////////////////////////////////////////////////

	private _updateCanvases($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		// Update canvas coordinates
		this.canvas.registerOnMouseMiddleMove($newOffsetX, $newOffsetY, $event);
		// Update trail point coordinates
		this.drawFunc.registerOnMouseMiddleMove($newOffsetX, $newOffsetY, $event);
	}
}
