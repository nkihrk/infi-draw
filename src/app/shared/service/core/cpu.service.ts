import { Injectable } from '@angular/core';
import { PointerEvent } from '../../model/pointer-event.model';
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

	constructor(private memory: MemoryService, private register: RegisterService) {}

	////////////////////////////////////////////////////////////////////////////////////////////
	//
	// CPU
	//
	////////////////////////////////////////////////////////////////////////////////////////////

	update($event: PointerEvent): void {
		// Update mouseOffset
		this.memory.pointerOffset.current.x = $event.x - this.memory.renderer.canvasWrapper.getBoundingClientRect().left;
		this.memory.pointerOffset.current.y = $event.y - this.memory.renderer.canvasWrapper.getBoundingClientRect().top;
		this.memory.pointerOffset.raw.x = $event.x;
		this.memory.pointerOffset.raw.y = $event.y;

		// When mouse button is down
		if (this.memory.flgs.leftDownFlg || this.memory.flgs.middleDownFlg || this.memory.flgs.rightDownFlg) {
			this._onMouseDown();
		}

		// When mouse button is up
		if (this.memory.flgs.leftUpFlg || this.memory.flgs.middleUpFlg || this.memory.flgs.rightUpFlg) {
			this._onMouseUp();
		}

		// Update anytime when the event is not mousedown
		if (!this.memory.flgs.downFlg) {
			this._onNoMouseDown($event);
		}

		// When double clicked
		if (this.memory.flgs.dblClickFlg) {
		}

		// Only allow left and middle buttons
		if (this.memory.flgs.leftDownMoveFlg || this.memory.flgs.middleDownMoveFlg) {
			this._onMouseMove($event);
		}
	}

	//////////////////////////////////////////////////////////
	//
	// Mousedown event
	//
	//////////////////////////////////////////////////////////

	_onMouseDown(): void {
		// Mousedown event with no mousemove
		this.memory.pointerOffset.prev.x = this.memory.pointerOffset.current.x;
		this.memory.pointerOffset.prev.y = this.memory.pointerOffset.current.y;

		this.register.onMouseDown();

		this.memory.states.isNeededToUpdateHistory = true;
	}

	private _onShadowMouseDown(): void {
		// Mousedown event with no mousemove
		this.memory.pointerOffset.prev.x = this.memory.pointerOffset.current.x;
		this.memory.pointerOffset.prev.y = this.memory.pointerOffset.current.y;

		this.register.onMouseDown();
	}

	//////////////////////////////////////////////////////////
	//
	// Mouseup event
	//
	//////////////////////////////////////////////////////////

	_onMouseUp(): void {
		this.register.onMouseUp();

		// Prevent infinite iteration on histroy updating
		this.memory.states.isNeededToUpdateHistory = false;
	}

	private _onShadowMouseUp(): void {
		this.register.onMouseUp();
	}

	//////////////////////////////////////////////////////////
	//
	// All events but mousedown
	//
	//////////////////////////////////////////////////////////

	_onNoMouseDown($event: PointerEvent): void {
		// Wheel event - zooming-in/out
		if (this.memory.flgs.wheelFlg) {
			// Watch wheel events to detect an end of the event
			this.detectWheelEnd();
		}

		this.register.onNoMouseDown($event);
	}

	private _onShadowNoMouseDown($event: PointerEvent): void {
		this.register.onNoMouseDown($event);
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
	// Mousemove event
	//
	//////////////////////////////////////////////////////////

	_onMouseMove($event: PointerEvent): void {
		// Mousemove event with mousedown (Wheel event is excluded)
		if (!this.memory.flgs.wheelFlg) {
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

			this.register.onMouseMove(newOffsetX, newOffsetY, $event);

			// Prevent infinite iteration on histroy updating
			this.memory.states.isNeededToUpdateHistory = false;
		}
	}

	private _onIdle($event: PointerEvent): void {
		if (!!this.idleTimer) clearInterval(this.idleTimer);
		this.idleTimer = setTimeout(() => {
			this._onShadowMouseUp();
			this._onShadowNoMouseDown($event);
			this._onShadowMouseDown();
		}, 100);
	}
}
