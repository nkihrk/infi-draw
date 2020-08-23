import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';

@Injectable({
	providedIn: 'root'
})
export class PenService {
	constructor(private memory: MemoryService) {}

	activate(): void {
		this.memory.reservedByFunc = {
			name: 'pen',
			type: 'draw',
			group: 'brush'
		};
	}

	recordTrail(): void {
		const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
		const trail: Trail = this.memory.trailList[trailId];
		const point: Point = {
			id: trail.points.length,
			color: this.memory.brush.color,
			visibility: true,
			offset: {
				prevOffsetX: this.memory.mouseOffset.x,
				prevOffsetY: this.memory.mouseOffset.y,
				newOffsetX: this.memory.mouseOffset.x,
				newOffsetY: this.memory.mouseOffset.y
			},
			pressure: 1,
			lineWidth: this.memory.brush.lineWidth.draw
		};

		if (this._ignoreDuplication(point.offset.prevOffsetX, point.offset.prevOffsetY)) {
			this._validateMinMax(trail, point.offset.newOffsetX, point.offset.newOffsetY);
			trail.points.push(point);
			console.log(trail.points.length);
		}
	}

	private _validateMinMax($trail: Trail, $x: number, $y: number): void {
		$trail.min.newOffsetX = Math.min($trail.min.newOffsetX, $x);
		$trail.min.newOffsetY = Math.min($trail.min.newOffsetY, $y);

		$trail.max.newOffsetX = Math.max($trail.max.newOffsetX, $x);
		$trail.max.newOffsetY = Math.max($trail.max.newOffsetY, $y);
	}

	private _ignoreDuplication($x: number, $y: number): boolean {
		const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
		const trail: Trail = this.memory.trailList[trailId];
		const points: Point[] = trail.points;

		if (points.length > 1) {
			const pointId: number = points.length - 1;
			const prevPoint: Point = points[pointId - 1];

			if (prevPoint.offset.newOffsetX === $x && prevPoint.offset.newOffsetY === $y) {
				return false;
			}
		}

		return true;
	}
}
