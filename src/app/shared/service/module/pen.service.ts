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
		this.validateMinMax(
			trail,
			point.relativeOffset.x * this.memory.canvasOffset.zoomRatio + trail.origin.newOffsetX,
			point.relativeOffset.y * this.memory.canvasOffset.zoomRatio + trail.origin.newOffsetY
		);

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
			const x: number = prevP.relativeOffset.x + Math.sin(angle) * i;
			const y: number = prevP.relativeOffset.y + Math.cos(angle) * i;
			const point: Point = this._creatPoint($trail);
			point.relativeOffset = { x, y };

			$trail.points.push(point);
		}
	}

	private _distanceBetween($prevP: Point, $currentP: Point): number {
		return Math.sqrt(
			Math.pow($currentP.relativeOffset.x - $prevP.relativeOffset.x, 2) +
				Math.pow($currentP.relativeOffset.y - $prevP.relativeOffset.y, 2)
		);
	}

	private _angleBetween($prevP: Point, $currentP: Point): number {
		return Math.atan2(
			$currentP.relativeOffset.x - $prevP.relativeOffset.x,
			$currentP.relativeOffset.y - $prevP.relativeOffset.y
		);
	}

	private _creatPoint($trail: Trail): Point {
		const point: Point = {
			id: $trail.points.length,
			color: this.memory.brush.color,
			visibility: true,
			relativeOffset: {
				x: (this.memory.pointerOffset.current.x - $trail.origin.newOffsetX) / this.memory.canvasOffset.zoomRatio,
				y: (this.memory.pointerOffset.current.y - $trail.origin.newOffsetY) / this.memory.canvasOffset.zoomRatio
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
