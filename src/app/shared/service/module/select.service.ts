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
			let min: Offset = {
				prevOffsetX: Infinity,
				prevOffsetY: Infinity,
				newOffsetX: Infinity,
				newOffsetY: Infinity
			};
			let max: Offset = {
				prevOffsetX: -Infinity,
				prevOffsetY: -Infinity,
				newOffsetX: -Infinity,
				newOffsetY: -Infinity
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

				const tmp: { min: Offset; max: Offset; lineWidth: number } = this._getNewMinMax(min, max, lineWidth, trail);
				min = tmp.min;
				max = tmp.max;
				lineWidth = tmp.lineWidth;

				// Reset selectedId if its already selected
				// For multi-select
				if (this.memory.keyMap.Shift && this._validateBounding(trail.min, trail.max, trail.points[0].lineWidth)) {
					this.memory.selectedList[i] = -1;
				}
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

	private _validateBounding($min: Offset, $max: Offset, $lineWidth: number): boolean {
		const offset: PointerOffset = this.memory.pointerOffset;

		const minX: number = $min.newOffsetX - $lineWidth * this.memory.canvasOffset.zoomRatio;
		const minY: number = $min.newOffsetY - $lineWidth * this.memory.canvasOffset.zoomRatio;
		const maxX: number = $max.newOffsetX + $lineWidth * this.memory.canvasOffset.zoomRatio * 2;
		const maxY: number = $max.newOffsetY + $lineWidth * this.memory.canvasOffset.zoomRatio * 2;

		const isInBoundingX: boolean = minX <= offset.current.x && offset.current.x <= maxX;
		const isInBoundingY: boolean = minY <= offset.current.y && offset.current.y <= maxY;

		return isInBoundingX && isInBoundingY;
	}

	private _getNewMinMax(
		$min: Offset,
		$max: Offset,
		$lineWidth: number,
		$trail: Trail
	): { min: Offset; max: Offset; lineWidth: number } {
		$min.newOffsetX = Math.min($min.newOffsetX, $trail.min.newOffsetX);
		$min.newOffsetY = Math.min($min.newOffsetY, $trail.min.newOffsetY);

		$max.newOffsetX = Math.max($max.newOffsetX, $trail.max.newOffsetX);
		$max.newOffsetY = Math.max($max.newOffsetY, $trail.max.newOffsetY);

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
				currentP.relativeOffset.x * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetX;
			const currentPoffsetY: number =
				currentP.relativeOffset.y * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetY;
			ctx.moveTo(currentPoffsetX, currentPoffsetY);

			if (nextP && nextP.visibility) {
				const nextPoffsetX: number =
					nextP.relativeOffset.x * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetX;
				const nextPoffsetY: number =
					nextP.relativeOffset.y * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetY;
				ctx.lineTo(nextPoffsetX, nextPoffsetY);
			} else if (prevP && prevP.visibility) {
				const prevPoffsetX: number =
					prevP.relativeOffset.x * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetX;
				const prevPoffsetY: number =
					prevP.relativeOffset.y * this.memory.canvasOffset.zoomRatio + $trail.origin.newOffsetY;
				ctx.lineTo(prevPoffsetX, prevPoffsetY);
			}
		}
	}
}
