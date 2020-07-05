import { ElementRef, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Flgs } from '../../model/flg.model';
import { History } from '../../model/history.model';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {
  // Current history index
  private i = 0;

  public historyList: History[] = [
    {
      canvasOffsets: {
        zoomRatio: 1,
        prevOffsetX: 0,
        prevOffsetY: 0,
        newOffsetX: 0,
        newOffsetY: 0
      },
      isChangedStates: false
    }
  ];
  public history: History = this.historyList[this.i];

  public flgs: Flgs = {
    dblClickFlg: false,
    downFlg: false,
    // - Similarly to mousedown events
    leftDownFlg: false,
    middleDownFlg: false,
    rightDownFlg: false,
    // - Similarly to mouseup events
    leftUpFlg: false,
    middleUpFlg: false,
    rightUpFlg: false,
    // - Similarly to mousedown + mousemove events
    leftDownMoveFlg: false,
    middleDownMoveFlg: false,
    rightDownMoveFlg: false,
    // - Similarly to wheel event
    wheelFlg: false
  };

  public states = {
    isPreventSelect: false,
    isPreventWheel: false,
    isPreventWholeTrans: false,
    isNeededToUpdateHistory: false
  };

  public mousePos = { x: 0, y: 0, prevX: 0, prevY: 0, rawX: 0, rawY: 0 };

  public reserveByFunc = {
    name: '',
    flgs: ['']
  };

  public readonly constant = {
    ZOOM_SPEED: 0.2, // Zoom speed of canvas
    GRID_COLOR: '#373543',
    GRID_SCALE: 50,
    RULER_COLOR: '#606060',
    NUM_COLOR: '#9e9e9e',
    FONT_TYPE: 'bold sans-serif'
  };

  public renderer: Renderer = { ctx: {} as Ctx } as Renderer;

  constructor() {}

  get refIndex(): number {
    return this.i;
  }

  init(
    $wrapperElem: ElementRef<HTMLDivElement>,
    $rulerWrapperElem: ElementRef,
    $canvasElem: ElementRef<HTMLCanvasElement>,
    $lElem: ElementRef<HTMLCanvasElement>,
    $cElem: ElementRef<HTMLCanvasElement>
  ): void {
    // Wrapper
    this.renderer.wrapper = $wrapperElem.nativeElement;
    this.renderer.rulerWrapper = $rulerWrapperElem.nativeElement;

    // Renderer
    this.renderer.mainCanvas = $canvasElem.nativeElement;
    this.renderer.lCanvas = $lElem.nativeElement;
    this.renderer.cCanvas = $cElem.nativeElement;

    // Buffer
    this.renderer.gridBuffer = document.createElement('canvas');
    this.renderer.lBuffer = document.createElement('canvas');
    this.renderer.cBuffer = document.createElement('canvas');

    // Ctx
    this.renderer.ctx.main = this.renderer.mainCanvas.getContext('2d');
    this.renderer.ctx.l = this.renderer.lCanvas.getContext('2d');
    this.renderer.ctx.c = this.renderer.cCanvas.getContext('2d');
    this.renderer.ctx.gridBuffer = this.renderer.gridBuffer.getContext('2d');
    this.renderer.ctx.lBuffer = this.renderer.lBuffer.getContext('2d');
    this.renderer.ctx.cBuffer = this.renderer.cBuffer.getContext('2d');

    // setInterval(() => {
    // }, 1000);
  }

  undo(): void {
    let i: number = this.refIndex;
    i -= i - 1 > -1 ? 1 : 0;
    this._updateRefIndex(i);
  }

  redo(): void {
    let i: number = this.refIndex;
    i += i + 1 < this.historyList.length ? 1 : 0;
    this._updateRefIndex(i);
  }

  _updateRefIndex($i: number): void {
    this.i = $i;
    this.history = this.historyList[this.i];
  }

  pileNewHistory($history: History): void {
    const h: History[] = _.take(this.historyList, this.i + 1);
    this.historyList = h;
    this.historyList.push({
      canvasOffsets: _.cloneDeep($history.canvasOffsets),
      isChangedStates: true // To tell its states changing
    });

    this.i += 1;
    this.history = this.historyList[this.i];
  }
}

export interface Renderer {
  wrapper: HTMLDivElement;
  rulerWrapper: HTMLDivElement;
  mainCanvas: HTMLCanvasElement;
  gridBuffer: HTMLCanvasElement;
  lCanvas: HTMLCanvasElement;
  cCanvas: HTMLCanvasElement;
  lBuffer: HTMLCanvasElement;
  cBuffer: HTMLCanvasElement;
  ctx: {
    main: CanvasRenderingContext2D;
    gridBuffer: CanvasRenderingContext2D;
    l: CanvasRenderingContext2D;
    c: CanvasRenderingContext2D;
    lBuffer: CanvasRenderingContext2D;
    cBuffer: CanvasRenderingContext2D;
  };
}

export interface Ctx {
  main: CanvasRenderingContext2D;
  gridBuffer: CanvasRenderingContext2D;
  l: CanvasRenderingContext2D;
  c: CanvasRenderingContext2D;
  lBuffer: CanvasRenderingContext2D;
  cBuffer: CanvasRenderingContext2D;
}
