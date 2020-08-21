import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';

@Injectable({
	providedIn: 'root'
})
export class CreateLineService {
	constructor(private memory: MemoryService) {}

	activate(): void {
		this.memory.reservedByFunc = {
			name: 'line',
			type: 'draw',
			group: 'brush'
		};
	}

	recordTrail($newOffsetX: number, $newOffsetY: number): void {
		const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
		const trail: Trail = this.memory.trailList[trailId];

		// Initialize points until mouseup event occured
		trail.points = [];

		if ($newOffsetX > 0) {
			for (let i = 0; i < $newOffsetX; i++) {
				const point: Point = {
					id: trail.points.length,
					color: this.memory.brush.color,
					visibility: true,
					offset: {
						prevOffsetX: this.memory.mouseOffset.prevX + i,
						prevOffsetY: this.memory.mouseOffset.prevY + this._getYfromX($newOffsetX, $newOffsetY, i),
						newOffsetX: this.memory.mouseOffset.prevX + i,
						newOffsetY: this.memory.mouseOffset.prevY + this._getYfromX($newOffsetX, $newOffsetY, i)
					},
					pressure: 1,
					lineWidth: this.memory.brush.lineWidth.draw
				};

				trail.points.push(point);
			}
		} else {
			for (let i = 0; i < -$newOffsetX; i++) {
				const point: Point = {
					id: trail.points.length,
					color: this.memory.brush.color,
					visibility: true,
					offset: {
						prevOffsetX: this.memory.mouseOffset.prevX - i,
						prevOffsetY: this.memory.mouseOffset.prevY + this._getYfromX($newOffsetX, $newOffsetY, -i),
						newOffsetX: this.memory.mouseOffset.prevX - i,
						newOffsetY: this.memory.mouseOffset.prevY + this._getYfromX($newOffsetX, $newOffsetY, -i)
					},
					pressure: 1,
					lineWidth: this.memory.brush.lineWidth.draw
				};

				trail.points.push(point);
			}
		}
	}

	private _getYfromX($newOffsetX: number, $newOffsetY: number, $i): number {
		return ($newOffsetY / $newOffsetX) * $i;
	}
}
