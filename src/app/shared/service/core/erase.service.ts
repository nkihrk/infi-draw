import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';

@Injectable({
  providedIn: 'root'
})
export class EraseService {
  constructor(private memory: MemoryService) {}

  activate(): void {
    this.memory.reservedByFunc = {
      name: 'erase',
      type: 'oekaki',
      flgs: ['']
    };
  }

  checkVisibility(): void {}
}
