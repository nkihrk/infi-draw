import { Injectable } from '@angular/core';
import { CanvasOffset } from '../../model/canvas-offset.model';
import { LibService } from '../util/lib.service';
import { MemoryService } from './memory.service';

@Injectable({
  providedIn: 'root'
})
export class RulerService {
  private rulerThickness = 20; // Thickness of the window ruler
  private parentScale = 100; // Parent scale of the window ruler
  private childScale = 10; // Child scale of the window ruler
  private middleLength = 0.5; // Length of the middleScale
  private childLength = 0.25; // Length of the childScale

  constructor(private lib: LibService, private memory: MemoryService) {}

  render(): void {
    const canvasOffset: CanvasOffset = this.memory.canvasOffset;
    if (this.parentScale * canvasOffset.zoomRatio * 2 < 100) {
      this.parentScale *= 2;
    }
    if ((this.parentScale * canvasOffset.zoomRatio) / 2 > 50) {
      const half = this.parentScale / 2;
      if (Number.isInteger(half)) this.parentScale = half;
    }

    const { renderer } = this.memory;

    this._createLine();
    const l: HTMLCanvasElement = renderer.ctx.rulerL.canvas;
    l.width = renderer.rulerWrapper.clientWidth;
    l.height = this.rulerThickness;
    renderer.ctx.rulerL.drawImage(renderer.rulerLbuffer, 0, 0);

    this._createColumn();
    const c: HTMLCanvasElement = renderer.ctx.rulerC.canvas;
    c.width = this.rulerThickness;
    c.height = renderer.rulerWrapper.clientHeight;
    renderer.ctx.rulerC.drawImage(renderer.rulerCbuffer, 0, 0);
  }

  _createLine(): void {
    const ctxLbuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.rulerLbuffer;
    const l: HTMLCanvasElement = ctxLbuffer.canvas;
    l.width = this.memory.renderer.rulerWrapper.clientWidth;
    l.height = this.rulerThickness;

    const canvasOffset: CanvasOffset = this.memory.canvasOffset;

    const offsetX: number = l.height + canvasOffset.newOffsetX;
    const remain: number = Math.floor(offsetX / (this.parentScale * canvasOffset.zoomRatio));
    const cutoff: number = offsetX - remain * this.parentScale * canvasOffset.zoomRatio;

    ctxLbuffer.translate(0.5, 0.5);

    // Frame
    ctxLbuffer.strokeStyle = this.memory.constant.RULER_COLOR;
    ctxLbuffer.lineWidth = 1;
    //ctxLbuffer.strokeRect(0, 0, l.width, l.height);

    ctxLbuffer.strokeStyle = this.memory.constant.RULER_COLOR;
    ctxLbuffer.font = this.memory.constant.FONT_TYPE;
    ctxLbuffer.fillStyle = this.memory.constant.NUM_COLOR;

    //////////////////////////////////////////////////////////////////// Children
    const childStep: number = (this.parentScale / this.childScale) * canvasOffset.zoomRatio;
    const childOffsetY: number = this.rulerThickness * (1 - this.childLength);

    ctxLbuffer.beginPath();
    // Children - positive
    for (let i = cutoff; i < l.width; i += childStep) {
      ctxLbuffer.moveTo(i, childOffsetY);
      ctxLbuffer.lineTo(i, l.height);
    }
    // Children - negative
    for (let i = cutoff; i > 0; i -= childStep) {
      ctxLbuffer.moveTo(i, childOffsetY);
      ctxLbuffer.lineTo(i, l.height);
    }
    ctxLbuffer.stroke();

    //////////////////////////////////////////////////////////////////// Middle
    const middleStep = (this.parentScale / 2) * canvasOffset.zoomRatio;
    const middleOffsetY: number = this.rulerThickness * (1 - this.middleLength);

    ctxLbuffer.beginPath();
    // Middle - positive
    for (let i = cutoff; i < l.width; i += middleStep) {
      ctxLbuffer.clearRect(i - 1, childOffsetY, 2, l.height);
      ctxLbuffer.moveTo(i, middleOffsetY);
      ctxLbuffer.lineTo(i, l.height);
    }
    // Middle - negative
    for (let i = cutoff; i > 0; i -= middleStep) {
      ctxLbuffer.clearRect(i - 1, childOffsetY, 2, l.height);
      ctxLbuffer.moveTo(i, middleOffsetY);
      ctxLbuffer.lineTo(i, l.height);
    }
    ctxLbuffer.stroke();

    //////////////////////////////////////////////////////////////////// Parents
    let scaleCount = 0;
    const parentStep: number = this.parentScale * canvasOffset.zoomRatio;

    ctxLbuffer.beginPath();
    // Parents - positive
    for (let i = cutoff; i < l.width; i += parentStep) {
      ctxLbuffer.clearRect(i - 1, 1, 2, l.height);
      ctxLbuffer.moveTo(i, 0);
      ctxLbuffer.lineTo(i, l.height);
      ctxLbuffer.fillText(`${Math.abs((remain - scaleCount) * this.parentScale)}`, i + 5, 10);
      scaleCount++;
    }
    // Parents - nagative
    scaleCount = 0;
    for (let i = cutoff; i > parentStep; i -= parentStep) {
      ctxLbuffer.clearRect(i - 1, 1, 2, l.height);
      ctxLbuffer.moveTo(i, 0);
      ctxLbuffer.lineTo(i, l.height);
      ctxLbuffer.fillText(`${Math.abs((remain - scaleCount) * this.parentScale)}`, i + 5, 10);
      scaleCount++;
    }
    ctxLbuffer.stroke();

    // Empty box
    ctxLbuffer.beginPath();
    ctxLbuffer.setLineDash([]);
    ctxLbuffer.clearRect(-0.5, -0.5, this.rulerThickness, this.rulerThickness);
    ctxLbuffer.strokeStyle = this.memory.constant.RULER_COLOR;
    ctxLbuffer.moveTo(this.rulerThickness, 0);
    ctxLbuffer.lineTo(this.rulerThickness, this.rulerThickness);
    ctxLbuffer.stroke();
  }

  _createColumn(): void {
    const ctxCbuffer: CanvasRenderingContext2D = this.memory.renderer.ctx.rulerCbuffer;
    const c: HTMLCanvasElement = ctxCbuffer.canvas;
    c.width = this.rulerThickness;
    c.height = this.memory.renderer.rulerWrapper.clientHeight;

    const canvasOffset: CanvasOffset = this.memory.canvasOffset;

    const offsetY: number = c.width + canvasOffset.newOffsetY;
    const remain: number = Math.floor(offsetY / (this.parentScale * canvasOffset.zoomRatio));
    const cutoff: number = offsetY - remain * this.parentScale * canvasOffset.zoomRatio;

    ctxCbuffer.translate(0.5, 0.5);
    ctxCbuffer.clearRect(0, 0, c.width, c.height);

    // Frame
    ctxCbuffer.strokeStyle = this.memory.constant.RULER_COLOR;
    ctxCbuffer.lineWidth = 1;
    //ctxCbuffer.strokeRect(0, 0, c.width, c.height);

    ctxCbuffer.strokeStyle = this.memory.constant.RULER_COLOR;
    ctxCbuffer.font = this.memory.constant.FONT_TYPE;
    ctxCbuffer.fillStyle = this.memory.constant.NUM_COLOR;

    //////////////////////////////////////////////////////////////////// Children
    const childStep: number = (this.parentScale / this.childScale) * canvasOffset.zoomRatio;
    const childOffsetX: number = this.rulerThickness * (1 - this.childLength);

    ctxCbuffer.beginPath();
    // Children - positive
    for (let i = cutoff; i < c.height; i += childStep) {
      ctxCbuffer.moveTo(childOffsetX, i);
      ctxCbuffer.lineTo(c.width, i);
    }
    // Children - nagative
    for (let i = cutoff; i > 0; i -= childStep) {
      ctxCbuffer.moveTo(childOffsetX, i);
      ctxCbuffer.lineTo(c.width, i);
    }
    ctxCbuffer.stroke();

    //////////////////////////////////////////////////////////////////// Middle
    const middleStep: number = (this.parentScale / 2) * canvasOffset.zoomRatio;
    const middleOffsetX: number = this.rulerThickness * (1 - this.middleLength);

    ctxCbuffer.beginPath();
    // Middle - positive
    for (let i = cutoff; i < c.height; i += middleStep) {
      ctxCbuffer.clearRect(childOffsetX, i - 1, c.width, 2);
      ctxCbuffer.moveTo(middleOffsetX, i);
      ctxCbuffer.lineTo(c.width, i);
    }
    // Middle - nagative
    for (let i = cutoff; i > 0; i -= middleStep) {
      ctxCbuffer.clearRect(childOffsetX, i - 1, c.width, 2);
      ctxCbuffer.moveTo(middleOffsetX, i);
      ctxCbuffer.lineTo(c.width, i);
    }
    ctxCbuffer.stroke();

    //////////////////////////////////////////////////////////////////// Parents
    let scaleCount = 0;
    const parentStep: number = this.parentScale * canvasOffset.zoomRatio;

    ctxCbuffer.beginPath();
    // Parents - positive
    for (let i = cutoff; i < c.height; i += parentStep) {
      ctxCbuffer.clearRect(1, i - 1, c.width, 2);
      ctxCbuffer.moveTo(0, i);
      ctxCbuffer.lineTo(c.width, i);
      this._fillTextLine(ctxCbuffer, `${Math.abs((remain - scaleCount) * this.parentScale)}`, 4, i + 10);
      scaleCount++;
    }
    // Parents - negative
    scaleCount = 0;
    for (let i = cutoff; i > parentStep; i -= parentStep) {
      ctxCbuffer.clearRect(1, i - 1, c.width, 2);
      ctxCbuffer.moveTo(0, i);
      ctxCbuffer.lineTo(c.width, i);
      this._fillTextLine(ctxCbuffer, `${Math.abs((remain - scaleCount) * this.parentScale)}`, 4, i + 10);
      scaleCount++;
    }
    ctxCbuffer.stroke();

    // Empty box
    ctxCbuffer.beginPath();
    ctxCbuffer.setLineDash([]);
    ctxCbuffer.clearRect(-0.5, -0.5, this.rulerThickness, this.rulerThickness);
    ctxCbuffer.strokeStyle = this.memory.constant.RULER_COLOR;
    ctxCbuffer.moveTo(0, this.rulerThickness);
    ctxCbuffer.lineTo(this.rulerThickness, this.rulerThickness);
    ctxCbuffer.stroke();
  }

  _fillTextLine(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
    const textList: string[] = text.toString().split('');
    const lineHeight: number = ctx.measureText('あ').width;
    textList.forEach(($txt, $i) => {
      const resY: number = y + lineHeight * $i - lineHeight * textList.length - 5;
      ctx.fillText($txt, x, this.lib.f2i(resY));
    });
  }
}
