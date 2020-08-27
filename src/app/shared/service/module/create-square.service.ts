import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Trail } from '../../model/trail.model';
import { Point } from '../../model/point.model';

@Injectable({
	providedIn: 'root'
})
export class CreateSquareService {
	private cutoff = 50;

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

		// Initialize points until mouseup event occured
		trail.points = [];

		const totalLengthX: number = Math.abs($newOffsetX) * this.cutoff;
		const totalLengthY: number = Math.abs($newOffsetY) * this.cutoff;
		const cutoffX: number = totalLengthX / this.cutoff;
		const cutoffY: number = totalLengthY / this.cutoff;

		// →
		if ($newOffsetX > 0) {
			for (let i = 0; i <= totalLengthX; i += cutoffX) {
				const fixedI: number = i / this.cutoff;
				const point: Point = this._creatPoint(trail, fixedI, 0);

				trail.points.push(point);
			}
		} else if ($newOffsetX < 0) {
			for (let i = 0; i <= totalLengthX; i += cutoffX) {
				const fixedI: number = i / this.cutoff;
				const point: Point = this._creatPoint(trail, -fixedI, 0);

				trail.points.push(point);
			}
		}

		// ↓
		if ($newOffsetY > 0) {
			for (let i = 0; i <= totalLengthY; i += cutoffY) {
				const fixedI: number = i / this.cutoff;
				const point: Point = this._creatPoint(trail, $newOffsetX, fixedI);

				trail.points.push(point);
			}
		} else if ($newOffsetY < 0) {
			for (let i = 0; i <= totalLengthY; i += cutoffY) {
				const fixedI: number = i / this.cutoff;
				const point: Point = this._creatPoint(trail, $newOffsetX, -fixedI);

				trail.points.push(point);
			}
		}

		// ←
		if ($newOffsetX > 0) {
			for (let i = totalLengthX; i >= 0; i -= cutoffX) {
				const fixedI: number = i / this.cutoff;
				const point: Point = this._creatPoint(trail, fixedI, $newOffsetY);

				trail.points.push(point);
			}
		} else if ($newOffsetX < 0) {
			for (let i = totalLengthX; i >= 0; i -= cutoffX) {
				const fixedI: number = i / this.cutoff;
				const point: Point = this._creatPoint(trail, -fixedI, $newOffsetY);

				trail.points.push(point);
			}
		}

		// ↑
		if ($newOffsetY > 0) {
			for (let i = totalLengthY; i >= 0; i -= cutoffY) {
				const fixedI: number = i / this.cutoff;
				const point: Point = this._creatPoint(trail, 0, fixedI);

				trail.points.push(point);
			}
		} else if ($newOffsetY < 0) {
			for (let i = totalLengthY; i >= 0; i -= cutoffY) {
				const fixedI: number = i / this.cutoff;
				const point: Point = this._creatPoint(trail, 0, -fixedI);

				trail.points.push(point);
			}
		}
	}

	private _creatPoint($trail: Trail, $x: number, $y: number): Point {
		const point: Point = {
			id: $trail.points.length,
			color: this.memory.brush.color,
			visibility: true,
			offset: {
				prevOffsetX: this.memory.mouseOffset.prevX + $x,
				prevOffsetY: this.memory.mouseOffset.prevY + $y,
				newOffsetX: this.memory.mouseOffset.prevX + $x,
				newOffsetY: this.memory.mouseOffset.prevY + $y
			},
			pressure: 1,
			lineWidth: this.memory.brush.lineWidth.draw
		};

		return point;
	}
}
