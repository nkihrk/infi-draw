import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Trail } from '../../model/trail.model';
import { DebugService } from '../util/debug.service';
import { Offset } from '../../model/offset.model';
import { PointerOffset } from '../../model/pointer-offset.model';
import { Point } from '../../model/point.model';
import { Erase } from '../../model/erase.model';

@Injectable({
	providedIn: 'root'
})
export class EraseService {
	constructor(private memory: MemoryService, private debug: DebugService) {}

	activate(): void {
		this.memory.reservedByFunc.current = {
			name: 'eraser',
			type: 'erase',
			group: 'brush'
		};
	}

	setVisibility() {
		const trailIndexes: number[] = this._validateTrails();

		if (this.memory.selectedList.length > 0) this.memory.selectedList = [];

		for (let i = 0; i < trailIndexes.length; i++) {
			const tId: number = trailIndexes[i];
			const trail: Trail = this.memory.trailList[tId];

			const pointIndexes: number[] = this._validatePoints(tId);

			for (let j = 0; j < pointIndexes.length; j++) {
				const pId: number = pointIndexes[j];
				const p: Point = this.memory.trailList[tId].points[pId];

				if (p.visibility) {
					const erase: Erase = this.memory.eraseList[this.memory.eraseList.length - 1];
					if (!erase.trailList[tId]) erase.trailList[tId] = { trailId: -1, pointIdList: [] };
					erase.trailList[tId].trailId = tId;
					erase.trailList[tId].pointIdList.push(pId);

					p.visibility = false;
				}
			}
		}
	}

	private _validateTrails(): number[] {
		const validList: number[] = [];

		const trailList: Trail[] = this.memory.trailList;
		for (let i = 0; i < trailList.length; i++) {
			const min: { x: number; y: number } = trailList[i].min;
			const max: { x: number; y: number } = trailList[i].max;
			const pointerOffset: PointerOffset = this.memory.pointerOffset;

			const x0: number =
				(min.x + trailList[i].origin.newOffsetX) * this.memory.canvasOffset.zoomRatio +
				this.memory.canvasOffset.newOffsetX;
			const y0: number =
				(min.y + trailList[i].origin.newOffsetY) * this.memory.canvasOffset.zoomRatio +
				this.memory.canvasOffset.newOffsetY;
			const x1: number =
				(max.x + trailList[i].origin.newOffsetX) * this.memory.canvasOffset.zoomRatio +
				this.memory.canvasOffset.newOffsetX;
			const y1: number =
				(max.y + trailList[i].origin.newOffsetY) * this.memory.canvasOffset.zoomRatio +
				this.memory.canvasOffset.newOffsetY;
			const r: number = this.memory.brush.lineWidth.erase / 2;

			// diff
			const diffX0: number = x0 - pointerOffset.current.x;
			const diffY0: number = y0 - pointerOffset.current.y;
			const diffX1: number = x1 - pointerOffset.current.x;
			const diffY1: number = y1 - pointerOffset.current.y;

			// Corner
			const corner0: boolean = diffX0 < r && diffY0 < r;
			const corner1: boolean = diffX0 < r && diffY1 < r;
			const corner2: boolean = diffX1 < r && diffY0 < r;
			const corner3: boolean = diffX1 < r && diffY1 < r;
			const corner: boolean = corner0 || corner1 || corner2 || corner3;

			// Middle
			const middle0: boolean = y0 < pointerOffset.current.y - r && pointerOffset.current.y + r < y1;
			const middle1: boolean = x0 < pointerOffset.current.x - r && pointerOffset.current.x + r < x1;
			const middle: boolean = middle0 && middle1;

			if (corner || middle) validList.push(i);
		}

		return validList;
	}

	private _validatePoints($trailId: number): number[] {
		const validList: number[] = [];

		const trail: Trail = this.memory.trailList[$trailId];
		const points: Point[] = trail.points;

		for (let i = 0; i < points.length; i++) {
			const p: Point = points[i];
			const pointX: number =
				(p.relativeOffset.x + trail.origin.newOffsetX) * this.memory.canvasOffset.zoomRatio +
				this.memory.canvasOffset.newOffsetX;
			const pointY: number =
				(p.relativeOffset.y + trail.origin.newOffsetY) * this.memory.canvasOffset.zoomRatio +
				this.memory.canvasOffset.newOffsetY;
			const pointerOffset: PointerOffset = this.memory.pointerOffset;
			const r: number = this.memory.brush.lineWidth.erase / 2;

			const diffX: number = pointX - pointerOffset.current.x;
			const diffY: number = pointY - pointerOffset.current.y;
			const distance: number = Math.sqrt(diffX * diffX + diffY * diffY);

			const isCollided: boolean = distance - (p.lineWidth * p.pressure * this.memory.canvasOffset.zoomRatio) / 2 < r;

			if (isCollided) validList.push(i);
		}

		return validList;
	}
}
