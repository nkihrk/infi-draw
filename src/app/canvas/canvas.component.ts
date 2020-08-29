import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RulerService } from '../shared/service/core/ruler.service';
import { KeyEventService } from '../shared/service/core/key-event.service';
import { FuncService } from '../shared/service/core/func.service';
import { Key } from '../shared/model/key.model';
import { GridService } from '../shared/service/core/grid.service';
import { GpuService } from '../shared/service/core/gpu.service';
import { MemoryService } from '../shared/service/core/memory.service';
import { DebugService } from '../shared/service/util/debug.service';
import { FlgEventService } from '../shared/service/core/flg-event.service';
import { CpuService } from '../shared/service/core/cpu.service';
import { Pointer } from '../shared/model/pointer.model';
import { DrawService } from '../shared/service/module/draw.service';
import { UiService } from '../shared/service/core/ui.service';

@Component({
	selector: 'app-canvas',
	templateUrl: './canvas.component.html',
	styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
	@ViewChild('appWrapper', { static: true }) appWrapperRef: ElementRef<HTMLDivElement>;
	@ViewChild('canvasWrapper', { static: true }) canvasWrapperRef: ElementRef<HTMLDivElement>;
	@ViewChild('rulerWrapper', { static: true }) rulerWrapperRef: ElementRef<HTMLDivElement>;
	@ViewChild('canvasMain', { static: true }) mainRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('canvasUI', { static: true }) uiRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('canvasLine', { static: true }) lineRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('canvasColumn', { static: true }) columnRef: ElementRef<HTMLCanvasElement>;

	constructor(
		private ruler: RulerService,
		private keyevent: KeyEventService,
		private func: FuncService,
		private grid: GridService,
		private cpu: CpuService,
		private gpu: GpuService,
		private memory: MemoryService,
		private debug: DebugService,
		private flg: FlgEventService,
		private draw: DrawService,
		private ui: UiService
	) {}

	ngOnInit(): void {
		this.memory.initRenderer(
			this.appWrapperRef,
			this.canvasWrapperRef,
			this.rulerWrapperRef,
			this.mainRef,
			this.uiRef,
			this.lineRef,
			this.columnRef
		);
		this.render();
	}

	onPointerEvents($event: Pointer): void {
		this.flg.updateFlgs($event);
		this.cpu.update($event);
	}

	onKeyEvents($event: Key): void {
		this.keyevent.onKeyEvents($event);
	}

	onUnload($event: any): void {
		this.func.unload($event);
	}

	private render(): void {
		const r: FrameRequestCallback = () => {
			this._render();

			requestAnimationFrame(r);
		};
		requestAnimationFrame(r);
	}

	private _render(): void {
		// Module renderer
		this.ruler.render();
		this.grid.render();
		this.ui.render();
		this.draw.render();

		// Main renderer
		this.debug.render();
		this.gpu.render();
	}
}
