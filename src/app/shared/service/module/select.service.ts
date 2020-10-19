import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { LibService } from '../util/lib.service';
import { DrawService } from '../module/draw.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';
import { Pointer } from '../../model/pointer.model';
import { PointerOffset } from '../../model/pointer-offset.model';
import { Offset } from '../../model/offset.model';

@Injectable({
	providedIn: 'root'
})
export class SelectService {
	constructor(private memory: MemoryService, private lib: LibService, private draw: DrawService) {}

	activate(): void {
		this.memory.reservedByFunc.current = {
			name: 'select',
			type: '',
			group: ''
		};
	}

	updateTargetTrailOffset($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		for (let i = 0; i < this.memory.selectedList.length; i++) {
			const id: number = this.memory.selectedList[i];
			const trail: Trail = this.memory.trailList[id];

			// If none selected, return
			if (id === -1) continue;

			this.draw.updateTargetTrailOffsets(trail, $newOffsetX, $newOffsetY, $event);
		}
	}

	getTargetTrailId(): void {
		// Render color buffer
		this.preComputeColorBuffer();

		const ctx: CanvasRenderingContext2D = this.memory.renderer.ctx.colorBuffer;
		const trailListId: number = this.lib.checkHitArea(this.memory.pointerOffset, ctx, this.memory.trailList);

		this.select(trailListId);
	}

	private select($trailListId: number): void {
		const selectedList: number[] = this.memory.selectedList;

		if ($trailListId === -1) {
			let min = {
				x: Infinity,
				y: Infinity
			};
			let max = {
				x: -Infinity,
				y: -Infinity
			};
			let lineWidth = -Infinity;

			for (let i = 0; i < selectedList.length; i++) {
				const id: number = selectedList[i];
				// Return if none is selected
				if (id === -1) continue;

				const trail: Trail = this.memory.trailList[id];

				if (!trail.visibility) continue;

				let count = 0;
				for (let j = 0; j < trail.points.length; j++) {
					if (trail.points[j].visibility) continue;

					count++;
				}

				if (count === trail.points.length) continue;

				const fixedMin = {
					x: trail.min.x + trail.origin.newOffsetX,
					y: trail.min.y + trail.origin.newOffsetY
				};
				const fixedMax = {
					x: trail.max.x + trail.origin.newOffsetX,
					y: trail.max.y + trail.origin.newOffsetY
				};

				// Reset selectedId if its already selected
				// For multi-select
				if (this.memory.keyMap.Shift && this._validateBounding(fixedMin, fixedMax, trail.points[0].lineWidth)) {
					this.memory.selectedList[i] = -1;
				}

				const tmp: {
					min: { x: number; y: number };
					max: { x: number; y: number };
					lineWidth: number;
				} = this._getNewMinMax(min, max, lineWidth, trail);
				min = tmp.min;
				max = tmp.max;
				lineWidth = tmp.lineWidth;
			}

			// Initialize if none is selected
			if (!this._validateBounding(min, max, lineWidth)) this.memory.selectedList = [];
		} else {
			const selectedId: number = this._checkSelected($trailListId);

			if (selectedId === -1) {
				if (!this.memory.keyMap.Shift) this.memory.selectedList = [];

				this.memory.selectedList.push($trailListId);
			} else {
				// For multi-select
				if (this.memory.keyMap.Shift) this.memory.selectedList[selectedId] = -1;
			}
		}
	}

	// Return -1 if selected target is not present in the selectedList
	private _checkSelected($trailListId: number): number {
		const selectedList: number[] = this.memory.selectedList;

		for (let i = 0; i < selectedList.length; i++) {
			if ($trailListId === selectedList[i]) {
				return i;
			}
		}

		return -1;
	}

	private _validateBounding(
		$min: { x: number; y: number },
		$max: { x: number; y: number },
		$lineWidth: number
	): boolean {
		const fixedOffsetX =
			(this.memory.pointerOffset.current.x - this.memory.canvasOffset.newOffsetX) / this.memory.canvasOffset.zoomRatio;
		const fixedOffsetY =
			(this.memory.pointerOffset.current.y - this.memory.canvasOffset.newOffsetY) / this.memory.canvasOffset.zoomRatio;

		const minX: number = $min.x + $lineWidth;
		const minY: number = $min.y + $lineWidth;
		const maxX: number = $max.x + $lineWidth * 2;
		const maxY: number = $max.y + $lineWidth * 2;

		const isInBoundingX: boolean = minX <= fixedOffsetX && fixedOffsetX <= maxX;
		const isInBoundingY: boolean = minY <= fixedOffsetY && fixedOffsetY <= maxY;

		return isInBoundingX && isInBoundingY;
	}

	private _getNewMinMax(
		$min: { x: number; y: number },
		$max: { x: number; y: number },
		$lineWidth: number,
		$trail: Trail
	): { min: { x: number; y: number }; max: { x: number; y: number }; lineWidth: number } {
		$min.x = Math.min($min.x, $trail.min.x + $trail.origin.newOffsetX);
		$min.y = Math.min($min.y, $trail.min.y + $trail.origin.newOffsetY);

		$max.x = Math.max($max.x, $trail.max.x + $trail.origin.newOffsetX);
		$max.y = Math.max($max.y, $trail.max.y + $trail.origin.newOffsetY);

		$lineWidth = Math.max($lineWidth, $trail.points[0].lineWidth);

		return { min: $min, max: $max, lineWidth: $lineWidth };
	}

	private preComputeColorBuffer(): void {
		const ctx: CanvasRenderingContext2D = this.memory.renderer.ctx.colorBuffer;
		const c: HTMLCanvasElement = ctx.canvas;
		c.width = this.memory.renderer.canvasWrapper.clientWidth;
		c.height = this.memory.renderer.canvasWrapper.clientHeight;

		const trailList: Trail[] = this.memory.trailList;

		ctx.translate(0.5, 0.5);

		for (let i = 0; i < trailList.length; i++) {
			const trail: Trail = trailList[i];

			if (trail.visibility) {
				ctx.beginPath();
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';

				this._renderLine(ctx, trail);

				ctx.stroke();
			}
		}
	}

	private _renderLine($ctx: CanvasRenderingContext2D, $trail: Trail): void {
		for (let i = 0; i < $trail.points.length; i++) {
			const prevP: Point = $trail.points[i - 1];
			const currentP: Point = $trail.points[i];
			const nextP: Point = $trail.points[i + 1];

			if (!currentP.visibility) continue;

			const ctx: CanvasRenderingContext2D = $ctx;
			ctx.lineWidth = currentP.lineWidth * currentP.pressure * this.memory.canvasOffset.zoomRatio;
			ctx.strokeStyle = '#' + $trail.colorId;

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
				//this._createBezierCurve(ctx, currentP, nextP);
			} else if (prevP && prevP.visibility) {
				const prevPoffsetX: number =
					(prevP.relativeOffset.x + $trail.origin.newOffsetX) * this.memory.canvasOffset.zoomRatio +
					this.memory.canvasOffset.newOffsetX;
				const prevPoffsetY: number =
					(prevP.relativeOffset.y + $trail.origin.newOffsetY) * this.memory.canvasOffset.zoomRatio +
					this.memory.canvasOffset.newOffsetY;

				ctx.lineTo(prevPoffsetX, prevPoffsetY);
				//this._createBezierCurve(ctx, currentP, prevP);
			}
		}
	}
}
