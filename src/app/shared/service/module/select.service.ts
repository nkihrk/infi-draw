import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { LibService } from '../util/lib.service';
import { Point } from '../../model/point.model';
import { Trail } from '../../model/trail.model';

@Injectable({
	providedIn: 'root'
})
export class SelectService {
	constructor(private memory: MemoryService, private lib: LibService) {}

	activate(): void {
		this.memory.reservedByFunc.current = {
			name: 'select',
			type: '',
			group: ''
		};
	}

	getTargetTrail(): void {
		// Render color buffer
		this.preComputeColorBuffer();

		const ctx: CanvasRenderingContext2D = this.memory.renderer.ctx.colorBuffer;
		const trailListId: number = this.lib.checkHitArea(this.memory.pointerOffset, ctx, this.memory.trailList);
		console.log(trailListId);
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
}
