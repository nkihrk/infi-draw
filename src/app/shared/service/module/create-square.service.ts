import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Trail } from '../../model/trail.model';

@Injectable({
	providedIn: 'root'
})
export class CreateSquareService {
	constructor(private memory: MemoryService) {}

	activate(): void {
		this.memory.reservedByFunc = {
			name: 'square',
			type: 'draw',
			group: 'brush'
		};
	}

	recordTrail($newOffsetX: number, $newOffsetY: number): void {}
}
