import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Trail } from '../../model/trail.model';
import { Arc } from '../../model/arc.model';

@Injectable({
	providedIn: 'root'
})
export class CreateCircleService {
	private cutoff = 100;

	constructor(private memory: MemoryService) {}

	activate(): void {
		this.memory.reservedByFunc = {
			name: 'circle',
			type: 'draw',
			group: 'brush'
		};
	}

	recordTrail($newOffsetX: number, $newOffsetY: number): void {
		const trailId: number = this.memory.trailList.length > 0 ? this.memory.trailList.length - 1 : 0;
		const trail: Trail = this.memory.trailList[trailId];

		trail.arc = this._createArc($newOffsetX, $newOffsetY);
	}

	private _createArc($newOffsetX: number, $newOffsetY: number): Arc {
		const arc: Arc = {
			color: this.memory.brush.color,
			visibility: true,
			offset: {
				prevOffsetX: this.memory.mouseOffset.prevX + $newOffsetX / 2,
				prevOffsetY: this.memory.mouseOffset.prevY + $newOffsetY / 2,
				newOffsetX: this.memory.mouseOffset.prevX + $newOffsetX / 2,
				newOffsetY: this.memory.mouseOffset.prevY + $newOffsetY / 2
			},
			radius: {
				width: $newOffsetX / 2,
				height: $newOffsetY / 2
			},
			pressure: 1,
			lineWidth: this.memory.brush.lineWidth.draw,
			fragment: Array(this.cutoff).fill(true)
		};

		return arc;
	}
}
