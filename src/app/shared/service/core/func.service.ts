import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';

@Injectable({
  providedIn: 'root'
})
export class FuncService {
  constructor(private memory: MemoryService) {}

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
  // Undo / redo
  //
  //////////////////////////////////////////////////////////

  undo() {
    if (!this.memory.reserveByFunc.name) this.memory.undo();
    // console.log(this.memory.history.deleteList);
  }

  redo() {
    if (!this.memory.reserveByFunc.name) this.memory.redo();
    // console.log(this.memory.history.deleteList);
  }
}
