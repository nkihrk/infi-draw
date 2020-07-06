import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { DrawService } from './draw.service';

@Injectable({
  providedIn: 'root'
})
export class FuncService {
  constructor(private memory: MemoryService, private drawFunc: DrawService) {}

  //////////////////////////////////////////////////////////
  //
  // Unload
  //
  //////////////////////////////////////////////////////////

  unload($e: any): void {
    if (this.memory.history.isChangedStates) {
      $e.returnValue = true;
    }
  }

  //////////////////////////////////////////////////////////
  //
  // Draw
  //
  //////////////////////////////////////////////////////////

  draw(): void {
    this.drawFunc.activate();
  }

  //////////////////////////////////////////////////////////
  //
  // Undo / redo
  //
  //////////////////////////////////////////////////////////

  undo() {
    if (!this.memory.reservedByFunc.name) this.memory.undo();
    // console.log(this.memory.history.deleteList);
  }

  redo() {
    if (!this.memory.reservedByFunc.name) this.memory.redo();
    // console.log(this.memory.history.deleteList);
  }
}
