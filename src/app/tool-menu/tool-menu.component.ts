import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MemoryService } from '../shared/service/core/memory.service';
import { FuncService } from '../shared/service/core/func.service';

// Fontawesome
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faQuidditch } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-tool-menu',
	templateUrl: './tool-menu.component.html',
	styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent implements OnInit {
	@ViewChild('brushSizeWrapper', { static: true }) brushSizeWrapperRef: ElementRef<HTMLDivElement>;
	@ViewChild('brushSizeMeter', { static: true }) brushSizeMeterRef: ElementRef<HTMLDivElement>;

	// Fontawesome
	faSave = faSave;
	faUndo = faUndo;
	faRedo = faRedo;
	faQuidditch = faQuidditch;

	// Brush size
	previousBrushState = 'draw';
	drawBrushSize = this.memory.brushSize.lineWidth.draw;
	eraseBrushSize = this.memory.brushSize.lineWidth.erase;

	constructor(private memory: MemoryService, private func: FuncService) {}

	ngOnInit(): void {
		// Initialize brushSizeSlider
		this.memory.initBrushSizeSlider(this.brushSizeWrapperRef, this.brushSizeMeterRef);

		this.render();
	}

	render(): void {
		const r: FrameRequestCallback = () => {
			this._render();

			requestAnimationFrame(r);
		};
		requestAnimationFrame(r);
	}

	private _render(): void {
		const isDrawBrush = this.memory.reservedByFunc.name === 'draw';
		const isEraseBrush = this.memory.reservedByFunc.name === 'erase';
		if (isDrawBrush) {
			this.previousBrushState = 'draw';
			this.drawBrushSize = this.memory.brushSize.lineWidth.draw;
			this.memory.brushSizeSlider.meter.style.width = this.memory.brushSize.meterWidth.draw + '%';
		} else if (isEraseBrush) {
			this.previousBrushState = 'erase';
			this.eraseBrushSize = this.memory.brushSize.lineWidth.erase;
			this.memory.brushSizeSlider.meter.style.width = this.memory.brushSize.meterWidth.erase + '%';
		}
	}

	save(): void {
		this.func.save();
	}

	undo(): void {
		this.func.undo();
	}

	redo(): void {
		this.func.redo();
	}

	cleanUp(): void {
		this.func.cleanUp();
	}
}
