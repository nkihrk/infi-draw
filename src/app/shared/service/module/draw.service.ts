import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';
import { CoordService } from '../util/coord.service';
import { PointerEvent } from '../../model/pointer-event.model';

// Draw modules
import { PenService } from '../module/pen.service';
import { CreateSquareService } from '../module/create-square.service';
import { CreateLineService } from '../module/create-line.service';

@Injectable({
	providedIn: 'root'
})
export class DrawService {
	constructor(
		private memory: MemoryService,
		private coord: CoordService,
		private pen: PenService,
		private square: CreateSquareService,
		private line: CreateLineService
	) {}

	registerDrawFuncs($newOffsetX: number, $newOffsetY: number): void {
		const name: string = this.memory.reservedByFunc.name;

		if (name === 'pen') {
			this.pen.recordTrail();
		} else if (name === 'square') {
			this.square.recordTrail($newOffsetX, $newOffsetY);
		} else if (name === 'line') {
			this.line.recordTrail($newOffsetX, $newOffsetY);
		}
	}

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
		this._updateOffsets(0, 0, $event);
	}

	registerOnMouseMiddleMove($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
		this._updateOffsets($newOffsetX, $newOffsetY, $event);
	}

	private _updateOffsets($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
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

	render(): void {
		const ctxOekakiBuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.oekakiBuffer;
		const c: HTMLCanvasElement = ctxOekakiBuffer.canvas;
		c.width = this.memory.renderer.canvasWrapper.clientWidth;
		c.height = this.memory.renderer.canvasWrapper.clientHeight;

		const trailList: Trail[] = this.memory.trailList;

		ctxOekakiBuffer.translate(0.5, 0.5);

		for (let i = 0; i < trailList.length; i++) {
			const trail: Trail = trailList[i];

			if (trail.visibility) {
				ctxOekakiBuffer.beginPath();
				ctxOekakiBuffer.lineCap = 'round';
				ctxOekakiBuffer.lineJoin = 'round';

				this.renderLine(ctxOekakiBuffer, trail);

				ctxOekakiBuffer.stroke();
			}
		}
	}

	private renderLine($ctxOekakiBuffer: CanvasRenderingContext2D, $trail: Trail): void {
		for (let i = 0; i < $trail.points.length; i++) {
			const prevP: Point = $trail.points[i - 1];
			const currentP: Point = $trail.points[i];
			const nextP: Point = $trail.points[i + 1];

			if (!currentP.visibility) continue;

			const ctx: CanvasRenderingContext2D = $ctxOekakiBuffer;
			ctx.lineWidth = currentP.lineWidth * currentP.pressure * this.memory.canvasOffset.zoomRatio;
			ctx.strokeStyle = currentP.color;
			ctx.moveTo(currentP.offset.newOffsetX, currentP.offset.newOffsetY);

			if (nextP && nextP.visibility) {
				ctx.lineTo(nextP.offset.newOffsetX, nextP.offset.newOffsetY);
				//this._createBezierCurve(ctx, currentP, nextP);
			} else if (prevP && prevP.visibility) {
				ctx.lineTo(prevP.offset.newOffsetX, prevP.offset.newOffsetY);
				//this._createBezierCurve(ctx, currentP, prevP);
			}
		}
	}

	private _createBezierCurve($ctxOekakiBuffer: CanvasRenderingContext2D, $currentP, $newP): void {
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
	}

	private _midPointBetween(p1: { x: number; y: number }, p2: { x: number; y: number }): { x: number; y: number } {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}
}
