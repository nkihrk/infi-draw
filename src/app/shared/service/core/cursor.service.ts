import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';

@Injectable({
	providedIn: 'root'
})
export class CursorService {
	constructor(private memory: MemoryService) {}

	render(): void {
		const ctxUiBuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.uiBuffer;
		const c: HTMLCanvasElement = ctxUiBuffer.canvas;
		c.width = this.memory.renderer.canvasWrapper.clientWidth;
		c.height = this.memory.renderer.canvasWrapper.clientHeight;
		const name: string = this.memory.reservedByFunc.name;

		if (name === 'draw' || name === 'erase') {
			this._oekaki(name, ctxUiBuffer);
		} else if (name === 'hand') {
			this._hand();
		}
	}

	private _resetAppWrapperClass(): void {
		const appWrapper: HTMLDivElement = this.memory.renderer.appWrapper;
		appWrapper.className = '';
		appWrapper.classList.add('app-wrapper');
	}

	private _hand(): void {
		const appWrapper: HTMLDivElement = this.memory.renderer.appWrapper;

		if (!appWrapper.classList.contains('grab-cursor')) {
			this._resetAppWrapperClass();
			appWrapper.classList.add('grab-cursor');
		}
	}

	private _oekaki($name: string, $ctxUiBuffer: CanvasRenderingContext2D): void {
		const rawX: number = this.memory.mouseOffset.rawX;
		const rawY: number = this.memory.mouseOffset.rawY;
		const canvasX: number = this.memory.renderer.main.getBoundingClientRect().x;
		const canvasY: number = this.memory.renderer.main.getBoundingClientRect().y;
		const isCanvas: boolean = canvasX < rawX && canvasY < rawY;

		const appWrapper: HTMLDivElement = this.memory.renderer.appWrapper;
		if (appWrapper.classList.length > 1) {
			this._resetAppWrapperClass();
		}

		if (isCanvas && !this.memory.states.isCanvasLocked) {
			const x: number = this.memory.mouseOffset.x;
			const y: number = this.memory.mouseOffset.y;

			let r = 0;
			if ($name === 'draw') {
				r = (this.memory.constant.LINE_WIDTH * this.memory.canvasOffset.zoomRatio) / 2;
			} else if ($name === 'erase') {
				r = this.memory.constant.ERASER_LINE_WIDTH;
			}

			if (r > 0) {
				$ctxUiBuffer.translate(0.5, 0.5);
				$ctxUiBuffer.beginPath();
				$ctxUiBuffer.strokeStyle = this.memory.constant.STROKE_STYLE;
				$ctxUiBuffer.lineWidth = 1;
				$ctxUiBuffer.arc(x, y, r, 0, 2 * Math.PI);
				$ctxUiBuffer.stroke();
			}
		}
	}
}
