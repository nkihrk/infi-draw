import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Trail } from '../../model/trail.model';
import { Point } from '../../model/point.model';
import { Erase } from '../../model/erase.model';

@Injectable({
	providedIn: 'root'
})
export class CleanupService {
	constructor(private memory: MemoryService) {}

	activate(): void {
		// To store previous states
		const tmpReserved = this.memory.reservedByFunc.current;

		// To tell pipeline that this function is a part of the erase module
		this.memory.reservedByFunc.current = {
			name: 'cleanup',
			type: 'erase',
			group: 'brush'
		};
		this.memory.pileNewHistory();

		this.memory.selectedList = [];

		// Set visibility of all points to false
		this._setVisibilities();

		// initialize with previous states
		this.memory.reservedByFunc.current = tmpReserved;
	}

	private _setVisibilities(): void {
		const trailLists: Trail[] = this.memory.trailList;

		for (let i = 0; i < trailLists.length; i++) {
			const trail: Trail = trailLists[i];
			const points: Point[] = trailLists[i].points;

			for (let j = 0; j < points.length; j++) {
				const p: Point = points[j];

				if (p.visibility) {
					const erase: Erase = this.memory.eraseList[this.memory.eraseList.length - 1];

					if (!erase.trailList[i]) erase.trailList[i] = { trailId: -1, pointIdList: [] };

					erase.trailList[i].trailId = i;
					erase.trailList[i].pointIdList.push(j);
					p.visibility = false;
				}
			}
		}
	}
}
