import { Injectable } from '@angular/core';
import { Pointer } from '../../model/pointer.model';
import { MemoryService } from './memory.service';
import { PointerEventService } from './pointer-event.service';
import { Flgs } from '../../model/flgs.model';

@Injectable({
	providedIn: 'root'
})
export class RegisterService {
	constructor(private memory: MemoryService, private pointerEvent: PointerEventService) {}

	onPointerDown(): void {
		const flgs: Flgs = this.memory.flgs;
		const name: string = this.memory.reservedByFunc.current.name;

		this.pointerEvent.down();

		if (flgs.leftDownFlg) {
			this.pointerEvent.leftDown(name);
		} else if (flgs.rightDownFlg) {
			this.pointerEvent.rightDown();
		} else if (flgs.middleDownFlg) {
			this.pointerEvent.middleDown();
		}
	}

	onNoPointerDown($event: Pointer): void {
		const flgs: Flgs = this.memory.flgs;

		this.pointerEvent.noDown();

		// Wheel event - zooming-in/out
		if (flgs.wheelFlg) {
			this.pointerEvent.wheel($event);
		}
	}

	onPointerUp(): void {
		const flgs: Flgs = this.memory.flgs;

		if (flgs.leftUpFlg) {
			this.pointerEvent.leftUp();
		} else if (flgs.rightUpFlg) {
			this.pointerEvent.rightUp();
		} else if (flgs.middleUpFlg) {
			this.pointerEvent.middleUp();
		}
	}

	onPointerMove($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		const flgs: Flgs = this.memory.flgs;
		const type: string = this.memory.reservedByFunc.current.type;
		const name: string = this.memory.reservedByFunc.current.name;

		if (flgs.leftDownMoveFlg) {
			this.pointerEvent.leftDownMove(type, name, $newOffsetX, $newOffsetY, $event);
		} else if (flgs.rightDownMoveFlg) {
			this.pointerEvent.rightDownMove(type, $newOffsetX, $newOffsetY, $event);
		} else if (flgs.middleDownMoveFlg) {
			this.pointerEvent.middleDownMove($newOffsetX, $newOffsetY, $event);
		}
	}
}
