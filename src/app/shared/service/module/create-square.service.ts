import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Trail } from '../../model/trail.model';
import { Point } from '../../model/point.model';

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

		// Initialize points until mouseup event occured
		trail.points = [];

		// →
		if ($newOffsetX > 0) {
			for (let i = 0; i < $newOffsetX; i++) {
				const point: Point = {
					id: trail.points.length,
					color: this.memory.brush.color,
					visibility: true,
					offset: {
						prevOffsetX: this.memory.mouseOffset.prevX + i,
						prevOffsetY: this.memory.mouseOffset.prevY,
						newOffsetX: this.memory.mouseOffset.prevX + i,
						newOffsetY: this.memory.mouseOffset.prevY
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
						prevOffsetY: this.memory.mouseOffset.prevY,
						newOffsetX: this.memory.mouseOffset.prevX - i,
						newOffsetY: this.memory.mouseOffset.prevY
					},
					pressure: 1,
					lineWidth: this.memory.brush.lineWidth.draw
				};

				trail.points.push(point);
			}
		}

		// ↓
		if ($newOffsetY > 0) {
			for (let i = 0; i < $newOffsetY; i++) {
				const point: Point = {
					id: trail.points.length,
					color: this.memory.brush.color,
					visibility: true,
					offset: {
						prevOffsetX: this.memory.mouseOffset.prevX + $newOffsetX,
						prevOffsetY: this.memory.mouseOffset.prevY + i,
						newOffsetX: this.memory.mouseOffset.prevX + $newOffsetX,
						newOffsetY: this.memory.mouseOffset.prevY + i
					},
					pressure: 1,
					lineWidth: this.memory.brush.lineWidth.draw
				};

				trail.points.push(point);
			}
		} else {
			for (let i = 0; i < -$newOffsetY; i++) {
				const point: Point = {
					id: trail.points.length,
					color: this.memory.brush.color,
					visibility: true,
					offset: {
						prevOffsetX: this.memory.mouseOffset.prevX + $newOffsetX,
						prevOffsetY: this.memory.mouseOffset.prevY - i,
						newOffsetX: this.memory.mouseOffset.prevX + $newOffsetX,
						newOffsetY: this.memory.mouseOffset.prevY - i
					},
					pressure: 1,
					lineWidth: this.memory.brush.lineWidth.draw
				};

				trail.points.push(point);
			}
		}

		// ←
		if ($newOffsetX > 0) {
			for (let i = $newOffsetX; i > 0; i--) {
				const point: Point = {
					id: trail.points.length,
					color: this.memory.brush.color,
					visibility: true,
					offset: {
						prevOffsetX: this.memory.mouseOffset.prevX + i,
						prevOffsetY: this.memory.mouseOffset.prevY + $newOffsetY,
						newOffsetX: this.memory.mouseOffset.prevX + i,
						newOffsetY: this.memory.mouseOffset.prevY + $newOffsetY
					},
					pressure: 1,
					lineWidth: this.memory.brush.lineWidth.draw
				};

				trail.points.push(point);
			}
		} else {
			for (let i = -$newOffsetX; i > 0; i--) {
				const point: Point = {
					id: trail.points.length,
					color: this.memory.brush.color,
					visibility: true,
					offset: {
						prevOffsetX: this.memory.mouseOffset.prevX - i,
						prevOffsetY: this.memory.mouseOffset.prevY + $newOffsetY,
						newOffsetX: this.memory.mouseOffset.prevX - i,
						newOffsetY: this.memory.mouseOffset.prevY + $newOffsetY
					},
					pressure: 1,
					lineWidth: this.memory.brush.lineWidth.draw
				};

				trail.points.push(point);
			}
		}

		// ↑
		if ($newOffsetY > 0) {
			for (let i = $newOffsetY; i > 0; i--) {
				const point: Point = {
					id: trail.points.length,
					color: this.memory.brush.color,
					visibility: true,
					offset: {
						prevOffsetX: this.memory.mouseOffset.prevX,
						prevOffsetY: this.memory.mouseOffset.prevY + i,
						newOffsetX: this.memory.mouseOffset.prevX,
						newOffsetY: this.memory.mouseOffset.prevY + i
					},
					pressure: 1,
					lineWidth: this.memory.brush.lineWidth.draw
				};

				trail.points.push(point);
			}
		} else {
			for (let i = -$newOffsetY; i > 0; i--) {
				const point: Point = {
					id: trail.points.length,
					color: this.memory.brush.color,
					visibility: true,
					offset: {
						prevOffsetX: this.memory.mouseOffset.prevX,
						prevOffsetY: this.memory.mouseOffset.prevY - i,
						newOffsetX: this.memory.mouseOffset.prevX,
						newOffsetY: this.memory.mouseOffset.prevY - i
					},
					pressure: 1,
					lineWidth: this.memory.brush.lineWidth.draw
				};

				trail.points.push(point);
			}
		}
	}
}
