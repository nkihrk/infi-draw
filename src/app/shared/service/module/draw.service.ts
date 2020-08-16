import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';
import { CoordService } from '../util/coord.service';
import { PointerEvent } from '../../model/pointer-event.model';

@Injectable({
	providedIn: 'root'
})
export class DrawService {
	constructor(private memory: MemoryService, private coord: CoordService) {}

	registerOnMouseDown(): void {
		const trailList: Trail[] = this.memory.trailList;

		for (let i = 0; i < trailList.length; i++) {
			const t: Trail = trailList[i];
			t.min.prevOffsetX = t.min.newOffsetX;
			t.min.prevOffsetY = t.min.newOffsetY;
			t.max.prevOffsetX = t.max.newOffsetX;
			t.max.prevOffsetY = t.max.newOffsetY;

			for (let j = 0; j < t.points.length; j++) {
				const p: Point = t.points[j];
				p.offset.prevOffsetX = p.offset.newOffsetX;
				p.offset.prevOffsetY = p.offset.newOffsetY;
			}
		}
	}

	registerOnNoMouseDown($event: PointerEvent): void {
		this.updateOffsets(0, 0, $event);
	}

	registerOnMouseMiddleMove($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
		this.updateOffsets($newOffsetX, $newOffsetY, $event);
	}

	updateOffsets($newOffsetX: number, $newOffsetY: number, $event?: PointerEvent): void {
		const trailList: Trail[] = this.memory.trailList;

		for (let i = 0; i < trailList.length; i++) {
			const t: Trail = trailList[i];
			this.coord.updateOffsets($newOffsetX, $newOffsetY, t.min, $event);
			this.coord.updateOffsets($newOffsetX, $newOffsetY, t.max, $event);

			for (let j = 0; j < t.points.length; j++) {
				const p: Point = t.points[j];
				this.coord.updateOffsets($newOffsetX, $newOffsetY, p.offset, $event);
			}
		}
	}

	activate(): void {
		this.memory.reservedByFunc = {
			name: 'draw',
			type: 'oekaki',
			flgs: ['']
		};
	}

	recordTrail(): void {
		const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
		const trail: Trail = this.memory.trailList[trailId];
		const point: Point = {
			id: trail.points.length,
			color: '#ffffff',
			visibility: true,
			offset: {
				prevOffsetX: this.memory.mouseOffset.x,
				prevOffsetY: this.memory.mouseOffset.y,
				newOffsetX: this.memory.mouseOffset.x,
				newOffsetY: this.memory.mouseOffset.y
			},
			pressure: 1
		};

		if (this._ignoreDuplication(point.offset.prevOffsetX, point.offset.prevOffsetY)) {
			this._validateMinMax(trail, point.offset.newOffsetX, point.offset.newOffsetY);
			trail.points.push(point);
		}
	}

	_validateMinMax($trail: Trail, $x: number, $y: number): void {
		$trail.min.newOffsetX = Math.min($trail.min.newOffsetX, $x);
		$trail.min.newOffsetY = Math.min($trail.min.newOffsetY, $y);

		$trail.max.newOffsetX = Math.max($trail.max.newOffsetX, $x);
		$trail.max.newOffsetY = Math.max($trail.max.newOffsetY, $y);
	}

	_ignoreDuplication($x: number, $y: number): boolean {
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

	render(): void {
		const ctxOekakiBuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.oekakiBuffer;
		const c: HTMLCanvasElement = ctxOekakiBuffer.canvas;
		c.width = this.memory.renderer.canvasWrapper.clientWidth;
		c.height = this.memory.renderer.canvasWrapper.clientHeight;

		const trailList: Trail[] = this.memory.trailList;

		ctxOekakiBuffer.translate(0.5, 0.5);

		for (let i = 0; i < trailList.length; i++) {
			if (trailList[i].visibility) {
				ctxOekakiBuffer.beginPath();
				ctxOekakiBuffer.lineCap = 'round';
				ctxOekakiBuffer.lineJoin = 'round';
				ctxOekakiBuffer.lineWidth = this.memory.constant.LINE_WIDTH * this.memory.canvasOffset.zoomRatio;

				for (let j = 0; j < trailList[i].points.length; j++) {
					const prevP: Point = trailList[i].points[j - 1];
					const currentP: Point = trailList[i].points[j];
					const nextP: Point = trailList[i].points[j + 1];

					if (currentP.visibility) {
						ctxOekakiBuffer.strokeStyle = currentP.color;
						ctxOekakiBuffer.moveTo(currentP.offset.newOffsetX, currentP.offset.newOffsetY);

						if (nextP && nextP.visibility) {
							// ctxOekakiBuffer.lineTo(nextP.offset.newOffsetX, nextP.offset.newOffsetY);
							this._createBezierCurve(ctxOekakiBuffer, currentP, nextP);
						} else if (prevP && prevP.visibility) {
							// ctxOekakiBuffer.lineTo(prevP.offset.newOffsetX, prevP.offset.newOffsetY);
							this._createBezierCurve(ctxOekakiBuffer, currentP, prevP);
						}
					}
				}
			}

			ctxOekakiBuffer.stroke();
		}
	}

	_createBezierCurve($ctxOekakiBuffer: CanvasRenderingContext2D, $currentP, $newP): void {
		const currentP = {
			x: $currentP.offset.newOffsetX,
			y: $currentP.offset.newOffsetY
		};
		const newP = {
			x: $newP.offset.newOffsetX,
			y: $newP.offset.newOffsetY
		};
		const midPoint = this._midPointBetween(currentP, newP);

		$ctxOekakiBuffer.quadraticCurveTo($currentP.offset.newOffsetX, $currentP.offset.newOffsetY, midPoint.x, midPoint.y);
		$ctxOekakiBuffer.lineTo($newP.offset.newOffsetX, $newP.offset.newOffsetY);
	}

	_midPointBetween(p1: { x: number; y: number }, p2: { x: number; y: number }): { x: number; y: number } {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}
}
