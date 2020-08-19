import { Injectable } from '@angular/core';
import { PointerEvent } from '../../model/pointer-event.model';
import { Flgs } from '../../model/flgs.model';
import { CanvasService } from './canvas.service';

// Modules
import { DrawService } from '../module/draw.service';
import { EraseService } from '../module/erase.service';

@Injectable({
	providedIn: 'root'
})
export class MouseEventService {
	constructor(private canvas: CanvasService, private drawFunc: DrawService, private eraseFunc: EraseService) {}

	down(): void {
		this.canvas.registerOnMouseDown();
		this.drawFunc.registerOnMouseDown();
	}

	noDown(): void {
		this.canvas.registerOnMouseDown();
		this.drawFunc.registerOnMouseDown();
	}

	wheel($event: PointerEvent): void {
		this.canvas.registerOnNoMouseDown($event);
		this.drawFunc.registerOnNoMouseDown($event);
	}

	leftUp(): void {}

	rightUp(): void {}

	middleUp(): void {}

	leftDownMove($name: string, $newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
		switch ($name) {
			case 'draw':
				this.drawFunc.recordTrail();
				break;

			case 'erase':
				this.eraseFunc.setVisibility();
				break;

			case 'hand':
				this._updateCanvases($newOffsetX, $newOffsetY, $event);
				break;

			default:
				break;
		}
	}

	rightDownMove($name: string, $newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {}

	middleDownMove($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
		this._updateCanvases($newOffsetX, $newOffsetY, $event);
	}

	//////////////////////////////////////////////////////////
	//
	// Private methods
	//
	//////////////////////////////////////////////////////////

	private _updateCanvases($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
		// Update canvas coordinates
		this.canvas.registerOnMouseMiddleMove($newOffsetX, $newOffsetY, $event);
		// Update trail point coordinates
		this.drawFunc.registerOnMouseMiddleMove($newOffsetX, $newOffsetY, $event);
	}
}
