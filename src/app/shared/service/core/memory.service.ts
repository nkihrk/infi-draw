import { ElementRef, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Flgs } from '../../model/flgs.model';
import { History } from '../../model/history.model';
import { CanvasOffset } from '../../model/canvas-offset.model';
import { Trail } from '../../model/trail.model';
import { Erase } from '../../model/erase.model';
import { Point } from '../../model/point.model';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {
  // oekakiOrder
  private orderId = 0;
  // draw
  private drawId = 0;
  // erase
  private eraseId = 0;

  public canvasOffset: CanvasOffset = {
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

  public mouseOffset = {
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
    LINE_WIDTH: 2,
    ERASER_LINE_WIDTH: 50
  };

  public renderer: Renderer = { ctx: {} as Ctx } as Renderer;

  constructor() {}

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
    this.renderer.debugger = document.createElement('canvas');
    this.renderer.ctx.debugger = this.renderer.debugger.getContext('2d');

    //setInterval(() => {
    //console.log(this.eraseList);
    //}, 1000);
  }

  undo(): void {
    const drawOrErase: number = this.oekakiOrder[this.orderId - 1];
    if (drawOrErase === 1) {
      // draw
      if (this.drawId > 0) {
        const trail: Trail = this.trailList[this.drawId - 1];
        trail.visibility = false;

        let dId: number = this.drawId;
        dId -= dId - 1 > -1 ? 1 : 0;
        this.drawId = dId;
      }
    } else {
      // erase
      if (this.eraseId > 0) {
        const erase: Erase = this.eraseList[this.eraseId - 1];
        const trailList: { trailId: number; pointIdList: number[] }[] = erase.trailList;

        for (let i = 0; i < trailList.length; i++) {
          if (trailList[i]) {
            const pointList: number[] = trailList[i].pointIdList;

            for (let j = 0; j < pointList.length; j++) {
              const tId: number = trailList[i].trailId;
              const pId: number = pointList[j];
              const trail: Trail = this.trailList[tId];

              if (trail.points[pId]) trail.points[pId].visibility = !trail.points[pId].visibility;
            }
          }
        }

        let eId: number = this.eraseId;
        eId -= eId - 1 > -1 ? 1 : 0;
        this.eraseId = eId;
      }
    }

    let oId: number = this.orderId;
    oId -= oId - 1 > 0 ? 1 : 0;
    this.orderId = oId;
  }

  redo(): void {
    let oId: number = this.orderId;
    oId += oId < this.oekakiOrder.length ? 1 : 0;
    this.orderId = oId;

    const drawOrErase: number = this.oekakiOrder[oId - 1];
    if (drawOrErase === 1) {
      // draw
      let dId: number = this.drawId;
      dId += dId < this.trailList.length ? 1 : 0;
      this.drawId = dId;

      const trail: Trail = this.trailList[dId - 1];
      trail.visibility = true;
    } else {
      // erase
      let eId: number = this.eraseId;
      eId += eId < this.eraseList.length ? 1 : 0;
      this.eraseId = eId;

      const erase: Erase = this.eraseList[eId - 1];
      const trailList: { trailId: number; pointIdList: number[] }[] = erase.trailList;

      for (let i = 0; i < trailList.length; i++) {
        if (trailList[i]) {
          const pointList: number[] = trailList[i].pointIdList;

          for (let j = 0; j < pointList.length; j++) {
            const tId: number = trailList[i].trailId;
            const pId: number = pointList[j];
            const trail: Trail = this.trailList[tId];

            if (trail.points[pId]) trail.points[pId].visibility = !trail.points[pId].visibility;
          }
        }
      }
    }
  }

  pileNewHistory(): void {
    this.oekakiOrder = _.take(this.oekakiOrder, this.orderId);

    if (this.reservedByFunc.name === 'draw') {
      this.trailList = _.take(this.trailList, this.drawId);

      const trail: Trail = {
        id: this.trailList.length,
        visibility: true,
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

      // To tell 'draw'
      this.oekakiOrder.push(1);
      this.drawId++;
    } else if (this.reservedByFunc.name === 'erase') {
      this.eraseList = _.take(this.eraseList, this.eraseId);

      const erase: Erase = {
        id: this.eraseList.length,
        trailList: []
      };
      this.eraseList.push(erase);

      // To tell 'erase'
      this.oekakiOrder.push(0);
      this.eraseId++;
    }

    this.orderId++;
    this.states.isChangedStates = true;
  }
}

export interface Renderer {
  wrapper: HTMLDivElement;
  rulerWrapper: HTMLDivElement;
  // Debugger
  debugger: HTMLCanvasElement;
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
    debugger: CanvasRenderingContext2D;
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
  debugger: CanvasRenderingContext2D;
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
