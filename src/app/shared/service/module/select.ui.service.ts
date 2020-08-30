import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Trail } from '../../model/trail.model';
import { Offset } from '../../model/offset.model';

@Injectable({
	providedIn: 'root'
})
export class SelectUiService {
	private style = '#44AAFF';
	private canvasColor = '#32303f';
	private lineWidth = 1;
	private r = 5;

	constructor(private memory: MemoryService) {}

	render($ctx: CanvasRenderingContext2D): void {
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

		for (let i = 0; i < this.memory.selectedList.length; i++) {
			if (this.memory.selectedList[i] === -1) continue;

			const id: number = this.memory.selectedList[i];
			const trail: Trail = this.memory.trailList[id];
			const tmp: { min: Offset; max: Offset; lineWidth: number } = this._getNewMinMax(min, max, lineWidth, trail);

			min = tmp.min;
			max = tmp.max;
			lineWidth = tmp.lineWidth;

			// Create only frame
			this.createSelectFrame(trail.min, trail.max, trail.points[0].lineWidth, $ctx);
		}

		// Create select box
		this.createSelectBox(min, max, lineWidth, $ctx);
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

	private createSelectBox($min: Offset, $max: Offset, $lineWidth: number, $ctx: CanvasRenderingContext2D): void {
		const x: number = $min.newOffsetX - $lineWidth * this.memory.canvasOffset.zoomRatio;
		const y: number = $min.newOffsetY - $lineWidth * this.memory.canvasOffset.zoomRatio;
		const w: number = $max.newOffsetX - $min.newOffsetX + $lineWidth * this.memory.canvasOffset.zoomRatio * 2;
		const h: number = $max.newOffsetY - $min.newOffsetY + $lineWidth * this.memory.canvasOffset.zoomRatio * 2;

		// Frame
		this.createSelectFrame($min, $max, $lineWidth, $ctx);

		// Corner points
		$ctx.beginPath();
		$ctx.strokeStyle = this.canvasColor;
		$ctx.fillStyle = this.style;
		$ctx.lineWidth = this.lineWidth * 5;
		// Left top
		$ctx.moveTo(x, y);
		$ctx.arc(x, y, this.r, 0, Math.PI * 2);
		// Top middle
		$ctx.moveTo(x + w / 2, y);
		$ctx.arc(x + w / 2, y, this.r, 0, Math.PI * 2);
		// Right top
		$ctx.moveTo(x + w, y);
		$ctx.arc(x + w, y, this.r, 0, Math.PI * 2);
		// Right middle
		$ctx.moveTo(x + w, y + h / 2);
		$ctx.arc(x + w, y + h / 2, this.r, 0, Math.PI * 2);
		// Right bottom
		$ctx.moveTo(x + w, y + h);
		$ctx.arc(x + w, y + h, this.r, 0, Math.PI * 2);
		// Bottom middle
		$ctx.moveTo(x + w / 2, y + h);
		$ctx.arc(x + w / 2, y + h, this.r, 0, Math.PI * 2);
		// Left bottom
		$ctx.moveTo(x, y + h);
		$ctx.arc(x, y + h, this.r, 0, Math.PI * 2);
		// Left bottom
		$ctx.moveTo(x, y + h / 2);
		$ctx.arc(x, y + h / 2, this.r, 0, Math.PI * 2);
		$ctx.stroke();
		$ctx.fill();

		// Stick
		$ctx.beginPath();
		$ctx.strokeStyle = this.style;
		$ctx.lineWidth = this.lineWidth;
		// Stick
		$ctx.moveTo(x + w / 2, y);
		$ctx.lineTo(x + w / 2, y - 35);
		$ctx.stroke();

		// Rotate point
		$ctx.beginPath();
		$ctx.strokeStyle = this.style;
		$ctx.fillStyle = '#ffffff';
		$ctx.lineWidth = this.lineWidth * 2;
		// Point
		$ctx.arc(x + w / 2, y - 35, this.r, 0, Math.PI * 2);
		$ctx.fill();
		$ctx.stroke();
	}

	private createSelectFrame($min: Offset, $max: Offset, $lineWidth: number, $ctx: CanvasRenderingContext2D): void {
		const x: number = $min.newOffsetX - $lineWidth * this.memory.canvasOffset.zoomRatio;
		const y: number = $min.newOffsetY - $lineWidth * this.memory.canvasOffset.zoomRatio;
		const w: number = $max.newOffsetX - $min.newOffsetX + $lineWidth * this.memory.canvasOffset.zoomRatio * 2;
		const h: number = $max.newOffsetY - $min.newOffsetY + $lineWidth * this.memory.canvasOffset.zoomRatio * 2;

		// Frame
		$ctx.beginPath();
		$ctx.strokeStyle = this.style;
		$ctx.lineWidth = this.lineWidth;
		$ctx.rect(x, y, w, h);
		$ctx.stroke();
	}
}
