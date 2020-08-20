import { Injectable } from '@angular/core';
import { PointerEvent } from '../../model/pointer-event.model';
import { MemoryService } from './memory.service';
import { MouseEventService } from './mouse-event.service';
import { Flgs } from '../../model/flgs.model';

@Injectable({
	providedIn: 'root'
})
export class RegisterService {
	constructor(private memory: MemoryService, private mouseEvent: MouseEventService) {}

	onMouseDown(): void {
		this.mouseEvent.down();
	}

	onNoMouseDown($event: PointerEvent): void {
		const flgs: Flgs = this.memory.flgs;

		this.mouseEvent.noDown();

		// Wheel event - zooming-in/out
		if (flgs.wheelFlg) {
			this.mouseEvent.wheel($event);
		}
	}

	onMouseUp(): void {
		const flgs: Flgs = this.memory.flgs;

		if (flgs.leftUpFlg) {
			this.mouseEvent.leftUp();
		} else if (flgs.rightUpFlg) {
			this.mouseEvent.rightUp();
		} else if (flgs.middleUpFlg) {
			this.mouseEvent.middleUp();
		}
	}

	onMouseMove($newOffsetX: number, $newOffsetY: number, $event: PointerEvent): void {
		const flgs: Flgs = this.memory.flgs;
		const type: string = this.memory.reservedByFunc.type;
		const name: string = this.memory.reservedByFunc.name;

		if (flgs.leftDownMoveFlg) {
			this.mouseEvent.leftDownMove(type, name, $newOffsetX, $newOffsetY, $event);
		} else if (flgs.rightDownMoveFlg) {
			this.mouseEvent.rightDownMove(type, $newOffsetX, $newOffsetY, $event);
		} else if (flgs.middleDownMoveFlg) {
			this.mouseEvent.middleDownMove($newOffsetX, $newOffsetY, $event);
		}
	}
}
