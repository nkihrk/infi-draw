import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';
import { CoordService } from '../util/coord.service';
import { Pointer } from '../../model/pointer.model';

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
		const name: string = this.memory.reservedByFunc.current.name;

		if (this.memory.selectedList.length > 0) this.memory.selectedList = [];

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
			t.origin.prevOffsetX = t.origin.newOffsetX;
			t.origin.prevOffsetY = t.origin.newOffsetY;
		}
	}

	registerOnNoMouseDown(): void {
		this.registerOnMouseDown();
	}

	registerOnWheel($event: Pointer): void {
		this._updateOffsets(0, 0, $event);
	}

	registerOnMouseMiddleMove($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		this._updateOffsets($newOffsetX, $newOffsetY, $event);
	}

	private _updateOffsets($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		this.coord.updateOffset($newOffsetX, $newOffsetY, this.memory.canvasOffset, $event);
	}

	updateTargetTrailOffsets($trail: Trail, $newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		$trail.origin = this.coord.updateOffset(
			$newOffsetX / this.memory.canvasOffset.zoomRatio,
			$newOffsetY / this.memory.canvasOffset.zoomRatio,
			$trail.origin,
			$event
		);
	}

	updateOffsetsByZoom($x: number, $y: number, $deltaFlg: boolean): void {
		this.registerOnNoMouseDown();
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

			const currentPoffsetX: number =
				(currentP.relativeOffset.x + $trail.origin.newOffsetX) * this.memory.canvasOffset.zoomRatio +
				this.memory.canvasOffset.newOffsetX;
			const currentPoffsetY: number =
				(currentP.relativeOffset.y + $trail.origin.newOffsetY) * this.memory.canvasOffset.zoomRatio +
				this.memory.canvasOffset.newOffsetY;

			ctx.moveTo(currentPoffsetX, currentPoffsetY);

			if (nextP && nextP.visibility) {
				const nextPoffsetX: number =
					(nextP.relativeOffset.x + $trail.origin.newOffsetX) * this.memory.canvasOffset.zoomRatio +
					this.memory.canvasOffset.newOffsetX;
				const nextPoffsetY: number =
					(nextP.relativeOffset.y + $trail.origin.newOffsetY) * this.memory.canvasOffset.zoomRatio +
					this.memory.canvasOffset.newOffsetY;

				ctx.lineTo(nextPoffsetX, nextPoffsetY);
			} else if (prevP && prevP.visibility) {
				const prevPoffsetX: number =
					(prevP.relativeOffset.x + $trail.origin.newOffsetX) * this.memory.canvasOffset.zoomRatio +
					this.memory.canvasOffset.newOffsetX;
				const prevPoffsetY: number =
					(prevP.relativeOffset.y + $trail.origin.newOffsetY) * this.memory.canvasOffset.zoomRatio +
					this.memory.canvasOffset.newOffsetY;

				ctx.lineTo(prevPoffsetX, prevPoffsetY);
			}
		}
	}

	private _midPointBetween(p1: { x: number; y: number }, p2: { x: number; y: number }): { x: number; y: number } {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}
}
