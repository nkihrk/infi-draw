import { Injectable } from '@angular/core';
import { Pointer } from '../../model/pointer.model';
import { MemoryService } from './memory.service';
import { RegisterService } from './register.service';

@Injectable({
	providedIn: 'root'
})
export class CpuService {
	// Watch wheel events to detect an end
	private wInterval = 100;
	private wCounter1 = 0;
	private wCounter2 = 0;
	private wMaker = true;

	// Detect idling of pointer events
	private idleTimer: number;
	private idleInterval = 1;

	constructor(private memory: MemoryService, private register: RegisterService) {}

	////////////////////////////////////////////////////////////////////////////////////////////
	//
	// CPU
	//
	////////////////////////////////////////////////////////////////////////////////////////////

	update($event: Pointer): void {
		// Update ouseOffset
		this.memory.pointerOffset.current.x = $event.x - this.memory.renderer.canvasWrapper.getBoundingClientRect().left;
		this.memory.pointerOffset.current.y = $event.y - this.memory.renderer.canvasWrapper.getBoundingClientRect().top;
		this.memory.pointerOffset.raw.x = $event.x;
		this.memory.pointerOffset.raw.y = $event.y;

		// When pointer button is down
		if (this.memory.flgs.leftDownFlg || this.memory.flgs.middleDownFlg || this.memory.flgs.rightDownFlg) {
			this._onPointerDown();
		}

		// When pointer button is up
		if (this.memory.flgs.leftUpFlg || this.memory.flgs.middleUpFlg || this.memory.flgs.rightUpFlg) {
			this._onPointerUp();
		}

		// Update anytime when the event is not pointerdown
		if (!this.memory.flgs.downFlg) {
			this._onNoPointerDown($event);
		}

		// When double clicked
		if (this.memory.flgs.dblClickFlg) {
		}

		// Only allow left and middle buttons
		if (this.memory.flgs.leftDownMoveFlg || this.memory.flgs.middleDownMoveFlg) {
			this._onPointerMove($event);
		}
	}

	//////////////////////////////////////////////////////////
	//
	// Pointerdown event
	//
	//////////////////////////////////////////////////////////

	_onPointerDown(): void {
		// Pointerdown event with no pointermove
		this.memory.pointerOffset.prev.x = this.memory.pointerOffset.current.x;
		this.memory.pointerOffset.prev.y = this.memory.pointerOffset.current.y;
		this.memory.pointerOffset.tmp.x = this.memory.pointerOffset.current.x;
		this.memory.pointerOffset.tmp.y = this.memory.pointerOffset.current.y;

		this.register.onPointerDown();

		this.memory.states.isNeededToUpdateHistory = true;
	}

	private _onShadowPointerDown(): void {
		// Pointerdown event with no pointermove
		this.memory.pointerOffset.tmp.x = this.memory.pointerOffset.current.x;
		this.memory.pointerOffset.tmp.y = this.memory.pointerOffset.current.y;
	}

	//////////////////////////////////////////////////////////
	//
	// Pointerup event
	//
	//////////////////////////////////////////////////////////

	_onPointerUp(): void {
		this.register.onPointerUp();

		// Prevent infinite iteration on histroy updating
		this.memory.states.isNeededToUpdateHistory = false;
	}

	//////////////////////////////////////////////////////////
	//
	// All events but pointerdown
	//
	//////////////////////////////////////////////////////////

	_onNoPointerDown($event: Pointer): void {
		// Wheel event - zooming-in/out
		if (this.memory.flgs.wheelFlg) {
			// Watch wheel events to detect an end of the event
			this.detectWheelEnd();
		}

		this.register.onNoPointerDown($event);
	}

	// https://jsfiddle.net/rafaylik/sLjyyfox/
	private detectWheelEnd(): void {
		// if (this.wCounter1 === 0) this.memory.pileNewHistory(this.memory.history);
		this.wCounter1 += 1;
		if (this.wMaker) this._wheelStart();
	}

	private _wheelStart(): void {
		this.wMaker = false;
		this._wheelAct();
	}

	private _wheelAct(): void {
		this.wCounter2 = this.wCounter1;
		setTimeout(() => {
			if (this.wCounter2 === this.wCounter1) {
				this._wheelEnd();
			} else {
				this._wheelAct();
			}
		}, this.wInterval);
	}

	private _wheelEnd(): void {
		this.wCounter1 = 0;
		this.wCounter2 = 0;
		this.wMaker = true;
	}

	//////////////////////////////////////////////////////////
	//
	// Pointermove event
	//
	//////////////////////////////////////////////////////////

	_onPointerMove($event: Pointer): void {
		// Pointermove event with pointerdown (Wheel event is excluded)
		if (this.memory.flgs.wheelFlg) return;

		// Check if its idling
		this._onIdle($event);

		//////////////////////////////////////////////////////////
		//
		// Pile new history
		//
		//////////////////////////////////////////////////////////

		if (
			this.memory.states.isNeededToUpdateHistory &&
			this.memory.reservedByFunc.current.group === 'brush' &&
			this.memory.flgs.leftDownMoveFlg
		) {
			this.memory.pileNewHistory();
		}

		const newOffsetX: number = this.memory.pointerOffset.current.x - this.memory.pointerOffset.prev.x;
		const newOffsetY: number = this.memory.pointerOffset.current.y - this.memory.pointerOffset.prev.y;

		this.register.onPointerMove(newOffsetX, newOffsetY, $event);

		// Prevent infinite iteration on histroy updating
		this.memory.states.isNeededToUpdateHistory = false;
	}

	private _onIdle($event: Pointer): void {
		if (!!this.idleTimer) clearInterval(this.idleTimer);
		this.idleTimer = setTimeout(() => {
			this._onShadowPointerDown();
		}, this.idleInterval);
	}
}
