import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MemoryService } from '../shared/service/core/memory.service';
import { FuncService } from '../shared/service/core/func.service';

import Pickr from '@simonwep/pickr/dist/pickr.es5.min';

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

		// Create pickr
		this._createPickr();

		// Check current states for tool-menu
		this.render();
	}

	private _createPickr(): void {
		const pickr = Pickr.create({
			el: '#pickr',
			container: '#pickr-wrapper',
			theme: 'monolith',
			appClass: 'custom-pickr',
			padding: 20,
			autoReposition: true,

			swatches: [
				'rgba(244, 67, 54, 1)',
				'rgba(233, 30, 99, 0.95)',
				'rgba(156, 39, 176, 0.9)',
				'rgba(103, 58, 183, 0.85)',
				'rgba(63, 81, 181, 0.8)',
				'rgba(33, 150, 243, 0.75)',
				'rgba(3, 169, 244, 0.7)',
				'rgba(0, 188, 212, 0.7)',
				'rgba(0, 150, 136, 0.75)',
				'rgba(76, 175, 80, 0.8)',
				'rgba(139, 195, 74, 0.85)',
				'rgba(205, 220, 57, 0.9)',
				'rgba(255, 235, 59, 0.95)',
				'rgba(255, 193, 7, 1)'
			],

			components: {
				// Main components
				preview: true,
				opacity: true,
				hue: true,

				// Input / output Options
				interaction: {
					hex: false,
					rgba: false,
					hsla: false,
					hsva: false,
					cmyk: false,
					input: false,
					clear: false,
					save: true
				}
			}
		});
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
