import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RulerService } from '../shared/service/core/ruler.service';
import { KeyEventService } from '../shared/service/core/key-event.service';
import { FuncService } from '../shared/service/core/func.service';
import { Key } from '../shared/model/key.model';
import { GridService } from '../shared/service/core/grid.service';
import { GpuService } from '../shared/service/core/gpu.service';
import { MemoryService } from '../shared/service/core/memory.service';
import { FlgEventService } from '../shared/service/core/flg-event.service';
import { CpuService } from '../shared/service/core/cpu.service';
import { PointerEvent } from '../shared/model/pointer-event.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvasWrapper', { static: true }) wrapper: ElementRef<HTMLDivElement>;
  @ViewChild('rulerWrapper', { static: true }) rulerWrapper: ElementRef<HTMLDivElement>;
  @ViewChild('canvasMain', { static: true }) main: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasLine', { static: true }) l: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasColumn', { static: true }) c: ElementRef<HTMLCanvasElement>;

  constructor(
    private ruler: RulerService,
    private keyevent: KeyEventService,
    private func: FuncService,
    private grid: GridService,
    private cpu: CpuService,
    private gpu: GpuService,
    private memory: MemoryService,
    private flg: FlgEventService
  ) {}

  ngOnInit() {
    this.memory.init(this.wrapper, this.rulerWrapper, this.main, this.l, this.c);
    this.render();
  }

  onPointerEvents($event: PointerEvent): void {
    this.flg.updateFlgs($event);
    this.cpu.update($event);
  }

  onKeyEvents($event: Key): void {
    this.keyevent.onKeyEvents($event);
  }

  onUnload($event: any): void {
    this.func.unload($event);
  }

  render(): void {
    const r: FrameRequestCallback = () => {
      this._render();

      requestAnimationFrame(r);
    };
    requestAnimationFrame(r);
  }

  _render(): void {
    this.ruler.render();
    this.grid.render();
    this.gpu.render();
  }
}
