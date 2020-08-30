import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { LibService } from '../util/lib.service';
import { DrawService } from '../module/draw.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';
import { Pointer } from '../../model/pointer.model';
import { PointerOffset } from '../../model/pointer-offset.model';

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

	getTargetTrailId(): void {
		// Render color buffer
		this.preComputeColorBuffer();

		const ctx: CanvasRenderingContext2D = this.memory.renderer.ctx.colorBuffer;
		const trailListId: number = this.lib.checkHitArea(this.memory.pointerOffset, ctx, this.memory.trailList);

		this.singleSelect(trailListId);
	}

	private singleSelect($trailListId: number): void {
		if ($trailListId === -1) {
			// Return if none is selected
			if (this.memory.selectedList[0] === -1) return;

			const trail: Trail = this.memory.trailList[this.memory.selectedList[0]];
			// Reset selectedId if its not inside the bouding
			if (!this._validateBounding(trail)) this.memory.selectedList[0] = -1;
		} else {
			this.memory.selectedList[0] = $trailListId;
		}
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
			ctx.moveTo(currentP.offset.newOffsetX, currentP.offset.newOffsetY);

			if (nextP && nextP.visibility) {
				ctx.lineTo(nextP.offset.newOffsetX, nextP.offset.newOffsetY);
			} else if (prevP && prevP.visibility) {
				ctx.lineTo(prevP.offset.newOffsetX, prevP.offset.newOffsetY);
			}
		}
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

	private _validateBounding($trail: Trail): boolean {
		const offset: PointerOffset = this.memory.pointerOffset;

		const minX: number = $trail.min.newOffsetX - $trail.points[0].lineWidth * this.memory.canvasOffset.zoomRatio;
		const minY: number = $trail.min.newOffsetY - $trail.points[0].lineWidth * this.memory.canvasOffset.zoomRatio;
		const maxX: number = $trail.max.newOffsetX + $trail.points[0].lineWidth * this.memory.canvasOffset.zoomRatio * 2;
		const maxY: number = $trail.max.newOffsetY + $trail.points[0].lineWidth * this.memory.canvasOffset.zoomRatio * 2;

		const isInBoundingX: boolean = minX <= offset.current.x && offset.current.x <= maxX;
		const isInBoundingY: boolean = minY <= offset.current.y && offset.current.y <= maxY;

		return isInBoundingX && isInBoundingY;
	}
}
