import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';

@Injectable({
	providedIn: 'root'
})
export class PenService {
	private cutoff = 10;

	constructor(private memory: MemoryService) {}

	activate(): void {
		this.memory.reservedByFunc.current = {
			name: 'pen',
			type: 'draw',
			group: 'brush'
		};
	}

	recordTrail(): void {
		const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
		const trail: Trail = this.memory.trailList[trailId];
		const point: Point = this._creatPoint(trail);

		// Update bounding
		this.validateMinMax(trail, point.offset.newOffsetX, point.offset.newOffsetY);

		// Add a new point
		if (trail.points.length > 0) {
			this.addNewPoints(trail, point);
		} else {
			trail.points.push(point);
		}
	}

	private addNewPoints($trail: Trail, $currentP: Point): void {
		const prevP: Point = $trail.points[$trail.points.length - 1];
		const dist: number = this._distanceBetween(prevP, $currentP);
		const angle: number = this._angleBetween(prevP, $currentP);

		for (let i = 0; i < dist; i += this.cutoff) {
			const x: number = prevP.offset.newOffsetX + Math.sin(angle) * i;
			const y: number = prevP.offset.newOffsetY + Math.cos(angle) * i;
			const point: Point = this._creatPoint($trail);
			point.offset = {
				newOffsetX: x,
				newOffsetY: y,
				prevOffsetX: x,
				prevOffsetY: y
			};

			$trail.points.push(point);
		}
	}

	private _distanceBetween($prevP: Point, $currentP: Point): number {
		return Math.sqrt(
			Math.pow($currentP.offset.newOffsetX - $prevP.offset.newOffsetX, 2) +
				Math.pow($currentP.offset.newOffsetY - $prevP.offset.newOffsetY, 2)
		);
	}

	private _angleBetween($prevP: Point, $currentP: Point): number {
		return Math.atan2(
			$currentP.offset.newOffsetX - $prevP.offset.newOffsetX,
			$currentP.offset.newOffsetY - $prevP.offset.newOffsetY
		);
	}

	private _creatPoint($trail: Trail): Point {
		const point: Point = {
			id: $trail.points.length,
			color: this.memory.brush.color,
			visibility: true,
			offset: {
				prevOffsetX: this.memory.pointerOffset.current.x,
				prevOffsetY: this.memory.pointerOffset.current.y,
				newOffsetX: this.memory.pointerOffset.current.x,
				newOffsetY: this.memory.pointerOffset.current.y
			},
			pressure: 1,
			lineWidth: this.memory.brush.lineWidth.draw
		};

		return point;
	}

	private validateMinMax($trail: Trail, $x: number, $y: number): void {
		$trail.min.newOffsetX = Math.min($trail.min.newOffsetX, $x);
		$trail.min.newOffsetY = Math.min($trail.min.newOffsetY, $y);

		$trail.max.newOffsetX = Math.max($trail.max.newOffsetX, $x);
		$trail.max.newOffsetY = Math.max($trail.max.newOffsetY, $y);
	}
}
