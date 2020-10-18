import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';
import { Offset } from '../../model/offset.model';

@Injectable({
	providedIn: 'root'
})
export class CreateLineService {
	private cutoff = 50;

	constructor(private memory: MemoryService) {}

	activate(): void {
		this.memory.reservedByFunc.current = {
			name: 'line',
			type: 'draw',
			group: 'brush'
		};
	}

	recordTrail($newOffsetX: number, $newOffsetY: number): void {
		const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
		const trail: Trail = this.memory.trailList[trailId];

		// Initialize points until mouseup event occured
		trail.min = {
			prevOffsetX: Infinity,
			prevOffsetY: Infinity,
			newOffsetX: Infinity,
			newOffsetY: Infinity
		};
		trail.max = {
			prevOffsetX: -Infinity,
			prevOffsetY: -Infinity,
			newOffsetX: -Infinity,
			newOffsetY: -Infinity
		};
		trail.points = [];

		// Add points along straight line
		this.addNewPoints(trail, $newOffsetX, $newOffsetY);
	}

	private addNewPoints($trail: Trail, $newOffsetX: number, $newOffsetY): void {
		const totalLengthX: number = Math.abs($newOffsetX) * this.cutoff;
		const totalLengthY: number = Math.abs($newOffsetY) * this.cutoff;
		const cutoffX: number = totalLengthX / this.cutoff;
		const cutoffY: number = totalLengthY / this.cutoff;

		if ($newOffsetX > 0) {
			for (let i = 0; i <= totalLengthX; i += cutoffX) {
				const fixedI: number = i / this.cutoff;
				const point: Point = this._creatPoint($trail, fixedI, this._getYfromX($newOffsetX, $newOffsetY, fixedI));

				// Add bounding
				this._validateMinMax(
					$trail,
					point.relativeOffset.x * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetX,
					point.relativeOffset.y * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetY
				);

				$trail.points.push(point);
			}
		} else if ($newOffsetX < 0) {
			for (let i = 0; i <= totalLengthX; i += cutoffX) {
				const fixedI: number = i / this.cutoff;
				const point: Point = this._creatPoint($trail, -fixedI, this._getYfromX($newOffsetX, $newOffsetY, -fixedI));

				// Add bounding
				this._validateMinMax(
					$trail,
					point.relativeOffset.x * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetX,
					point.relativeOffset.y * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetY
				);

				$trail.points.push(point);
			}
		} else if ($newOffsetX === 0) {
			if ($newOffsetY > 0) {
				for (let i = 0; i <= totalLengthY; i += cutoffY) {
					const fixedI: number = i / this.cutoff;
					const point: Point = this._creatPoint($trail, 0, fixedI);

					// Add bounding
					this._validateMinMax(
						$trail,
						point.relativeOffset.x * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetX,
						point.relativeOffset.y * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetY
					);

					$trail.points.push(point);
				}
			} else if ($newOffsetY < 0) {
				for (let i = 0; i <= totalLengthY; i += cutoffY) {
					const fixedI: number = i / this.cutoff;
					const point: Point = this._creatPoint($trail, 0, -fixedI);

					// Add bounding
					this._validateMinMax(
						$trail,
						point.relativeOffset.x * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetX,
						point.relativeOffset.y * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetY
					);

					$trail.points.push(point);
				}
			}
		}
	}

	private _creatPoint($trail: Trail, $x: number, $y: number): Point {
		const point: Point = {
			id: $trail.points.length,
			color: this.memory.brush.color,
			visibility: true,
			relativeOffset: {
				x: $x / this.memory.canvasOffset.zoomRatio,
				y: $y / this.memory.canvasOffset.zoomRatio
			},
			pressure: 1,
			lineWidth: this.memory.brush.lineWidth.draw
		};

		return point;
	}

	private _getYfromX($newOffsetX: number, $newOffsetY: number, $i): number {
		return ($newOffsetY / $newOffsetX) * $i;
	}

	private _validateMinMax($trail: Trail, $x: number, $y: number): void {
		$trail.min.newOffsetX = Math.min($trail.min.newOffsetX, $x);
		$trail.min.newOffsetY = Math.min($trail.min.newOffsetY, $y);

		$trail.max.newOffsetX = Math.max($trail.max.newOffsetX, $x);
		$trail.max.newOffsetY = Math.max($trail.max.newOffsetY, $y);
	}
}
