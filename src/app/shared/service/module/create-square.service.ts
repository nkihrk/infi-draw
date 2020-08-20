import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Trail } from '../../model/trail.model';
import { Square } from '../../model/square.model';

@Injectable({
	providedIn: 'root'
})
export class CreateSquareService {
	constructor(private memory: MemoryService) {}

	activate(): void {
		this.memory.reservedByFunc = {
			name: 'square',
			type: 'draw',
			group: 'brush'
		};
	}

	recordTrail($newOffsetX: number, $newOffsetY: number): void {
		const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
		const trail: Trail = this.memory.trailList[trailId];

		if (!!trail.square) {
			const square: Square = {
				width: $newOffsetX,
				height: $newOffsetY,
				offset: {
					prevOffsetX: this.memory.mouseOffset.prevX,
					prevOffsetY: this.memory.mouseOffset.prevY,
					newOffsetX: this.memory.mouseOffset.prevX,
					newOffsetY: this.memory.mouseOffset.prevY
				},
				color: this.memory.brush.color,
				lineWidth: this.memory.brush.lineWidth.draw,
				visibility: true
			};
			trail.square = square;
		}

		// Update trail min and max offsets
		this._validateMinMax(trail, trail.square.offset.newOffsetX, trail.square.offset.newOffsetY);

		// Update width and height continuously
		trail.square.width = $newOffsetX / this.memory.canvasOffset.zoomRatio;
		trail.square.height = $newOffsetY / this.memory.canvasOffset.zoomRatio;

		console.log(trail.min, trail.max);
	}

	// これ修正する
	private _validateMinMax($trail: Trail, $x: number, $y: number): void {
		$trail.min.newOffsetX = Math.min($trail.min.newOffsetX, $x);
		$trail.min.newOffsetY = Math.min($trail.min.newOffsetY, $y);

		$trail.max.newOffsetX = Math.max($trail.max.newOffsetX, $x);
		$trail.max.newOffsetY = Math.max($trail.max.newOffsetY, $y);
	}
}
