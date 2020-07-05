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

  constructor(private memory: MemoryService, private register: RegisterService) {}

  ////////////////////////////////////////////////////////////////////////////////////////////
  //
  // CPU
  //
  ////////////////////////////////////////////////////////////////////////////////////////////

  update($event: PointerEvent): void {
    // Update mousePos
    this.memory.mousePos.x = $event.x - this.memory.renderer.wrapper.getBoundingClientRect().left;
    this.memory.mousePos.y = $event.y - this.memory.renderer.wrapper.getBoundingClientRect().top;
    this.memory.mousePos.rawX = $event.x;
    this.memory.mousePos.rawY = $event.y;

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
    this.memory.mousePos.prevX = this.memory.mousePos.x;
    this.memory.mousePos.prevY = this.memory.mousePos.y;

    this.register.onMouseDown();

    // This flag should be here for some reason idk
    this.memory.states.isNeededToUpdateHistory = true;
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

  //////////////////////////////////////////////////////////
  //
  // All events but mousedown
  //
  //////////////////////////////////////////////////////////

  _onNoMouseDown($event: PointerEvent): void {
    // Wheel event - zooming-in/out
    if (this.memory.flgs.wheelFlg) {
      // Watch wheel events to detect an end of the event
      this._detectWheelEnd();
    }

    this.register.onNoMouseDown($event);
  }

  // https://jsfiddle.net/rafaylik/sLjyyfox/
  _detectWheelEnd(): void {
    if (this.wCounter1 === 0) this.memory.pileNewHistory(this.memory.history);
    this.wCounter1 += 1;
    if (this.wMaker) this._wheelStart();
  }

  _wheelStart(): void {
    this.wMaker = false;
    this._wheelAct();
  }

  _wheelAct(): void {
    this.wCounter2 = this.wCounter1;
    setTimeout(() => {
      if (this.wCounter2 === this.wCounter1) {
        this._wheelEnd();
      } else {
        this._wheelAct();
      }
    }, this.wInterval);
  }

  _wheelEnd(): void {
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
      //////////////////////////////////////////////////////////
      //
      // Pile new history
      //
      //////////////////////////////////////////////////////////

      if (this.memory.states.isNeededToUpdateHistory && this.memory.flgs.middleDownMoveFlg) {
        this.memory.pileNewHistory(this.memory.history);
      }

      const newOffsetX: number = this.memory.mousePos.x - this.memory.mousePos.prevX;
      const newOffsetY: number = this.memory.mousePos.y - this.memory.mousePos.prevY;

      this.register.onMouseMove(newOffsetX, newOffsetY, $event);

      // Prevent infinite iteration on histroy updating
      this.memory.states.isNeededToUpdateHistory = false;
    }
  }
}
