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

  public mousePos = {
    x: -Infinity,
    y: -Infinity,
    rawX: -Infinity,
    rawY: -Infinity,
    prevX: -Infinity,
    prevY: -Infinity
  };

  public reservedByFunc = {
    name: 'draw',
    type: 'oekaki',
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
    this.renderer.main = $mainElem.nativeElement;
    this.renderer.ui = $uiElem.nativeElement;
    this.renderer.rulerL = $lElem.nativeElement;
    this.renderer.rulerC = $cElem.nativeElement;

    // Buffer
    this.renderer.uiBuffer = document.createElement('canvas');
    this.renderer.gridBuffer = document.createElement('canvas');
    this.renderer.oekakiBuffer = document.createElement('canvas');
    this.renderer.rulerLbuffer = document.createElement('canvas');
    this.renderer.rulerCbuffer = document.createElement('canvas');

    // ctx - Renderer
    this.renderer.ctx.main = this.renderer.main.getContext('2d');
    this.renderer.ctx.ui = this.renderer.ui.getContext('2d');
    this.renderer.ctx.rulerL = this.renderer.rulerL.getContext('2d');
    this.renderer.ctx.rulerC = this.renderer.rulerC.getContext('2d');

    // ctx - Buffer
    this.renderer.ctx.uiBuffer = this.renderer.uiBuffer.getContext('2d');
    this.renderer.ctx.gridBuffer = this.renderer.gridBuffer.getContext('2d');
    this.renderer.ctx.oekakiBuffer = this.renderer.oekakiBuffer.getContext('2d');
    this.renderer.ctx.rulerLbuffer = this.renderer.rulerLbuffer.getContext('2d');
    this.renderer.ctx.rulerCbuffer = this.renderer.rulerCbuffer.getContext('2d');

    // Debugger
    this.renderer.debug = document.createElement('canvas');
    this.renderer.ctx.debug = this.renderer.debug.getContext('2d');

    //    setInterval(() => {
    //console.log(this.trailList[0].min, this.trailList[0].max);
    //}, 1000);
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
        min: {
          prevOffsetX: Infinity,
          prevOffsetY: Infinity,
          newOffsetX: Infinity,
          newOffsetY: Infinity
        },
        max: {
          prevOffsetX: -Infinity,
          prevOffsetY: -Infinity,
          newOffsetX: -Infinity,
          newOffsetY: -Infinity
        },
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
  // Debugger
  debug: HTMLCanvasElement;
  // Renderer
  main: HTMLCanvasElement;
  ui: HTMLCanvasElement;
  rulerL: HTMLCanvasElement;
  rulerC: HTMLCanvasElement;
  // Buffer
  uiBuffer: HTMLCanvasElement;
  gridBuffer: HTMLCanvasElement;
  oekakiBuffer: HTMLCanvasElement;
  rulerLbuffer: HTMLCanvasElement;
  rulerCbuffer: HTMLCanvasElement;
  ctx: {
    // Debugger
    debug: CanvasRenderingContext2D;
    // Renderer
    main: CanvasRenderingContext2D;
    ui: CanvasRenderingContext2D;
    rulerL: CanvasRenderingContext2D;
    rulerC: CanvasRenderingContext2D;
    // Buffer
    uiBuffer: CanvasRenderingContext2D;
    gridBuffer: CanvasRenderingContext2D;
    oekakiBuffer: CanvasRenderingContext2D;
    rulerLbuffer: CanvasRenderingContext2D;
    rulerCbuffer: CanvasRenderingContext2D;
  };
}

export interface Ctx {
  // Debugger
  debug: CanvasRenderingContext2D;
  // Renderer
  main: CanvasRenderingContext2D;
  ui: CanvasRenderingContext2D;
  rulerL: CanvasRenderingContext2D;
  rulerC: CanvasRenderingContext2D;
  // Buffer
  uiBuffer: CanvasRenderingContext2D;
  gridBuffer: CanvasRenderingContext2D;
  oekakiBuffer: CanvasRenderingContext2D;
  rulerLbuffer: CanvasRenderingContext2D;
  rulerCbuffer: CanvasRenderingContext2D;
}
