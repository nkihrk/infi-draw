import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Trail } from '../../model/trail.model';

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
		if (this.memory.selectedId === -1) return;

		const id: number = this.memory.selectedId;
		const trail: Trail = this.memory.trailList[id];
		const x: number = trail.min.newOffsetX - trail.points[0].lineWidth * this.memory.canvasOffset.zoomRatio;
		const y: number = trail.min.newOffsetY - trail.points[0].lineWidth * this.memory.canvasOffset.zoomRatio;
		const w: number =
			trail.max.newOffsetX - trail.min.newOffsetX + trail.points[0].lineWidth * this.memory.canvasOffset.zoomRatio * 2;
		const h: number =
			trail.max.newOffsetY - trail.min.newOffsetY + trail.points[0].lineWidth * this.memory.canvasOffset.zoomRatio * 2;

		// Frame
		$ctx.beginPath();
		$ctx.strokeStyle = this.style;
		$ctx.lineWidth = this.lineWidth;
		$ctx.rect(x, y, w, h);
		// Stick
		$ctx.moveTo(x + w / 2, y);
		$ctx.lineTo(x + w / 2, y - 40);
		$ctx.stroke();

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

		// Rotate point
		$ctx.beginPath();
		$ctx.strokeStyle = this.style;
		$ctx.fillStyle = '#ffffff';
		$ctx.lineWidth = this.lineWidth * 2;
		// Point
		$ctx.arc(x + w / 2, y - 40, this.r, 0, Math.PI * 2);
		$ctx.fill();
		$ctx.stroke();
	}
}
