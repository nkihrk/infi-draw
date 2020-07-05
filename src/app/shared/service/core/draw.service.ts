import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  constructor(private memory: MemoryService) {}
}
