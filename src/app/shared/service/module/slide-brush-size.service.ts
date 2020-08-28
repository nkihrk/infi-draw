import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';

@Injectable({
	providedIn: 'root'
})
export class SlideBrushSizeService {
	private enableSliderFlg = false;

	constructor(private memory: MemoryService) {}

	activate($clientX: number): void {
		this.enableSliderFlg = true;

		this.changeSlideAmount($clientX);
	}

	disableSlider(): void {
		this.enableSliderFlg = false;
	}

	changeSlideAmount($clientX: number): void {
		if (this.enableSliderFlg) {
			let w: number =
				(($clientX - this.memory.brushSizeSlider.wrapper.getBoundingClientRect().left) /
					this.memory.brushSizeSlider.wrapper.getBoundingClientRect().width) *
				100;
			if (w <= 0) w = 0.5;
			if (w > 100) w = 100;

			// update memory
			if (this.memory.reservedByFunc.current.type === 'draw') {
				this.memory.brush.meterWidth.draw = w;
				this.memory.brush.lineWidth.draw = Math.floor((w / 100) * this.memory.constant.MAX_BRUSH_SIZE);
			} else if (this.memory.reservedByFunc.current.type === 'erase') {
				this.memory.brush.meterWidth.erase = w;
				this.memory.brush.lineWidth.erase = Math.floor((w / 100) * this.memory.constant.MAX_BRUSH_SIZE);
			}
		}
	}
}
