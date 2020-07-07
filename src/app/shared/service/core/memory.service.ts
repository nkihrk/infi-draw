import { ElementRef, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Flgs } from '../../model/flg.model';
import { History } from '../../model/history.model';
import { CanvasOffsets } from '../../model/canvas-offsets.model';
import { Trail } from '../../model/trail.model';
import { Erase } from '../../model/erase.model';
import { Point } from '../../model/point.model';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {
  // Current history index
  private i = 0;

  public historyList: History[] = [
    {
      trailList: [],
      isChangedStates: false
    }
  ];
  public history: History = this.historyList[this.i];

  public canvasOffsets: CanvasOffsets = {
    zoomRatio: 1,
    prevOffsetX: 0,
    prevOffsetY: 0,
    newOffsetX: 0,
    newOffsetY: 0
  };

  public trailList: Trail[] = [];
  public eraseList: Erase[] = [];
  public oekakiOrder: number[] = [];

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
    isNeededToUpdateHistory: false,
    isChangedStates: false
  };

  public mousePos = { x: 0, y: 0, rawX: 0, rawY: 0, prevX: 0, prevY: 0 };

  public reservedByFunc = {
    name: '',
    type: '',
    flgs: ['']
  };

  public readonly constant = {
    ZOOM_SPEED: 0.2, // Zoom speed of canvas
    GRID_COLOR: '#373543',
    GRID_SCALE: 50,
    RULER_COLOR: '#606060',
    NUM_COLOR: '#9e9e9e',
    FONT_TYPE: 'bold sans-serif',
    STROKE_STYLE: '#ffffff',
    LINE_WIDTH: 2
  };

  public renderer: Renderer = { ctx: {} as Ctx } as Renderer;

  constructor() {}

  get refIndex(): number {
    return this.i;
  }

  init(
    $wrapperElem: ElementRef<HTMLDivElement>,
    $rulerWrapperElem: ElementRef,
    $mainElem: ElementRef<HTMLCanvasElement>,
    $uiElem: ElementRef<HTMLCanvasElement>,
    $lElem: ElementRef<HTMLCanvasElement>,
    $cElem: ElementRef<HTMLCanvasElement>
  ): void {
    // Wrapper
    this.renderer.wrapper = $wrapperElem.nativeElement;
    this.renderer.rulerWrapper = $rulerWrapperElem.nativeElement;

    // Renderer
    this.renderer.mainCanvas = $mainElem.nativeElement;
    this.renderer.uiCanvas = $uiElem.nativeElement;
    this.renderer.lCanvas = $lElem.nativeElement;
    this.renderer.cCanvas = $cElem.nativeElement;

    // Buffer
    this.renderer.uiBuffer = document.createElement('canvas');
    this.renderer.gridBuffer = document.createElement('canvas');
    this.renderer.oekakiBuffer = document.createElement('canvas');
    this.renderer.lBuffer = document.createElement('canvas');
    this.renderer.cBuffer = document.createElement('canvas');

    // ctx - Renderer
    this.renderer.ctx.main = this.renderer.mainCanvas.getContext('2d');
    this.renderer.ctx.ui = this.renderer.uiCanvas.getContext('2d');
    this.renderer.ctx.l = this.renderer.lCanvas.getContext('2d');
    this.renderer.ctx.c = this.renderer.cCanvas.getContext('2d');

    // ctx - Buffer
    this.renderer.ctx.uiBuffer = this.renderer.uiBuffer.getContext('2d');
    this.renderer.ctx.gridBuffer = this.renderer.gridBuffer.getContext('2d');
    this.renderer.ctx.oekakiBuffer = this.renderer.oekakiBuffer.getContext('2d');
    this.renderer.ctx.lBuffer = this.renderer.lBuffer.getContext('2d');
    this.renderer.ctx.cBuffer = this.renderer.cBuffer.getContext('2d');

    //    setInterval(() => {
    //console.log(this.trailList[0].points[0].offsets);
    //}, 1000);

    this.reservedByFunc = {
      name: 'draw',
      type: 'oekaki',
      flgs: ['']
    };
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

  pileNewHistory(): void {
    if (this.reservedByFunc.name === 'draw') {
      const trail: Trail = {
        id: this.trailList.length,
        points: [] as Point[]
      };
      this.trailList.push(trail);

      this.oekakiOrder.push(1);

      this.states.isChangedStates = true;
    }
  }
}

export interface Renderer {
  wrapper: HTMLDivElement;
  rulerWrapper: HTMLDivElement;
  mainCanvas: HTMLCanvasElement;
  uiCanvas: HTMLCanvasElement;
  uiBuffer: HTMLCanvasElement;
  gridBuffer: HTMLCanvasElement;
  oekakiBuffer: HTMLCanvasElement;
  lCanvas: HTMLCanvasElement;
  cCanvas: HTMLCanvasElement;
  lBuffer: HTMLCanvasElement;
  cBuffer: HTMLCanvasElement;
  ctx: {
    main: CanvasRenderingContext2D;
    ui: CanvasRenderingContext2D;
    uiBuffer: CanvasRenderingContext2D;
    gridBuffer: CanvasRenderingContext2D;
    oekakiBuffer: CanvasRenderingContext2D;
    l: CanvasRenderingContext2D;
    c: CanvasRenderingContext2D;
    lBuffer: CanvasRenderingContext2D;
    cBuffer: CanvasRenderingContext2D;
  };
}

export interface Ctx {
  main: CanvasRenderingContext2D;
  ui: CanvasRenderingContext2D;
  uiBuffer: CanvasRenderingContext2D;
  gridBuffer: CanvasRenderingContext2D;
  oekakiBuffer: CanvasRenderingContext2D;
  l: CanvasRenderingContext2D;
  c: CanvasRenderingContext2D;
  lBuffer: CanvasRenderingContext2D;
  cBuffer: CanvasRenderingContext2D;
}
