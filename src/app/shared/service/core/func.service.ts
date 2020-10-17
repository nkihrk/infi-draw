import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { CleanupService } from '../module/cleanup.service';
import { SelectService } from '../module/select.service';
import { PenService } from '../module/pen.service';
import { EraseService } from '../module/erase.service';
import { CreateSquareService } from '../module/create-square.service';
import { CreateLineService } from '../module/create-line.service';
import { ZoomService } from '../module/zoom.service';

@Injectable({
	providedIn: 'root'
})
export class FuncService {
	constructor(
		private memory: MemoryService,
		private cleanupFunc: CleanupService,
		private selectFunc: SelectService,
		private penFunc: PenService,
		private eraseFunc: EraseService,
		private createSquareFunc: CreateSquareService,
		private createLineFunc: CreateLineService,
		private zoomFunc: ZoomService
	) {}

	//////////////////////////////////////////////////////////
	//
	// Save
	//
	//////////////////////////////////////////////////////////

	save(): void {}

	//////////////////////////////////////////////////////////
	//
	// Undo / redo
	//
	//////////////////////////////////////////////////////////

	undo(): void {
		this.memory.undo();
	}

	redo(): void {
		this.memory.redo();
	}

	//////////////////////////////////////////////////////////
	//
	// Unload
	//
	//////////////////////////////////////////////////////////

	unload($e: any): void {
		if (this.memory.states.isChangedStates) {
			$e.returnValue = true;
		}
	}

	//////////////////////////////////////////////////////////
	//
	// Select
	//
	//////////////////////////////////////////////////////////

	select(): void {
		this.selectFunc.activate();
	}

	selectAll(): void {
		const n: number = this.memory.trailList.length;

		this.memory.selectedList = [];

		for (let i = 0; i < n; i++) {
			if (!this.memory.trailList[i].visibility) continue;

			this.memory.selectedList.push(i);
		}
	}

	//////////////////////////////////////////////////////////
	//
	// Clean up
	//
	//////////////////////////////////////////////////////////

	cleanUp(): void {
		this.cleanupFunc.activate();
	}

	//////////////////////////////////////////////////////////
	//
	// Hand
	//
	//////////////////////////////////////////////////////////

	hand(): void {
		this.memory.reservedByFunc.current = {
			name: 'hand',
			type: '',
			group: ''
		};
	}

	//////////////////////////////////////////////////////////
	//
	// Pen
	//
	//////////////////////////////////////////////////////////

	pen(): void {
		this.penFunc.activate();
	}

	//////////////////////////////////////////////////////////
	//
	// Eraser
	//
	//////////////////////////////////////////////////////////

	eraser(): void {
		this.eraseFunc.activate();
	}

	//////////////////////////////////////////////////////////
	//
	// Create square
	//
	//////////////////////////////////////////////////////////

	createSquare(): void {
		this.createSquareFunc.activate();
	}

	//////////////////////////////////////////////////////////
	//
	// Create line
	//
	//////////////////////////////////////////////////////////

	createLine(): void {
		this.createLineFunc.activate();
	}

	//////////////////////////////////////////////////////////
	//
	// Zoom
	//
	//////////////////////////////////////////////////////////

	zoom($toggleFlg?: boolean): void {
		this.zoomFunc.activate($toggleFlg);
	}
}
