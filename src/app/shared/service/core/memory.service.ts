import { ElementRef, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LibService } from '../util/lib.service';
import { Flgs } from '../../model/flgs.model';
import { PointerOffset } from '../../model/pointer-offset.model';
import { History } from '../../model/history.model';
import { CanvasOffset } from '../../model/canvas-offset.model';
import { Trail } from '../../model/trail.model';
import { Erase } from '../../model/erase.model';
import { Point } from '../../model/point.model';

@Injectable({
	providedIn: 'root'
})
export class MemoryService {
	// brush order
	private orderId = -1;
	// draw
	private drawId = -1;
	// erase
	private eraseId = -1;

	trailList: Trail[] = [];
	eraseList: Erase[] = [];
	oekakiOrder: number[] = [];
	colorIdList: { id: number; colorId: string }[] = [];
	selectedList: number[] = [];

	keyMap: any = {};

	canvasOffset: CanvasOffset = {
		zoomRatio: 1,
		prevOffsetX: 0,
		prevOffsetY: 0,
		newOffsetX: 0,
		newOffsetY: 0
	};

	brush = {
		color: 'rgba(233, 30, 99, 0.95)',
		lineWidth: {
			draw: 10, // px
			erase: 50 // px
		},
		meterWidth: {
			draw: 1, // %
			erase: 1 // %
		}
	};

	flgs: Flgs = {
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

	states = {
		isPreventSelect: false,
		isPreventWheel: false,
		isPreventTrans: false,
		isNeededToUpdateHistory: false,
		isChangedStates: false,
		isCanvasLocked: false,
		isZoomCursorPositive: true
	};

	pointerOffset: PointerOffset = {
		current: {
			x: -Infinity,
			y: -Infinity
		},
		prev: {
			x: -Infinity,
			y: -Infinity
		},
		raw: {
			x: -Infinity,
			y: -Infinity
		},
		tmp: {
			x: -Infinity,
			y: -Infinity
		}
	};

	reservedByFunc = {
		current: {
			name: 'pen',
			type: 'draw',
			group: 'brush'
		},
		prev: {
			name: '',
			type: '',
			group: ''
		}
	};

	readonly constant = {
		WHEEL_ZOOM_SPEED: 0.2,
		POINTER_ZOOM_SPEED: 0.05,
		GRID_COLOR: '#373543',
		GRID_SCALE: 50,
		RULER_COLOR: '#606060',
		NUM_COLOR: '#9e9e9e',
		FONT_TYPE: 'bold sans-serif',
		STROKE_STYLE: '#ffffff',
		MAX_BRUSH_SIZE: 200
	};

	brushSizeSlider: BrushSizeSlider = {} as BrushSizeSlider;
	renderer: Renderer = { ctx: {} as Ctx } as Renderer;

	constructor(private lib: LibService) {}

	initBrushSizeSlider(
		$brushSizeWrapper: ElementRef<HTMLDivElement>,
		$brushSizeMeter: ElementRef<HTMLDivElement>
	): void {
		this.brushSizeSlider.wrapper = $brushSizeWrapper.nativeElement;
		this.brushSizeSlider.meter = $brushSizeMeter.nativeElement;

		// Initialize brushSizeMeter width
		this.brush.meterWidth.draw = (this.brush.lineWidth.draw / this.constant.MAX_BRUSH_SIZE) * 100;
		this.brush.meterWidth.erase = (this.brush.lineWidth.erase / this.constant.MAX_BRUSH_SIZE) * 100;
	}

	initRenderer(
		$appWrapperElem: ElementRef<HTMLDivElement>,
		$canvasWrapperElem: ElementRef<HTMLDivElement>,
		$rulerWrapperElem: ElementRef<HTMLDivElement>,
		$mainElem: ElementRef<HTMLCanvasElement>,
		$uiElem: ElementRef<HTMLCanvasElement>,
		$lElem: ElementRef<HTMLCanvasElement>,
		$cElem: ElementRef<HTMLCanvasElement>
	): void {
		// Wrapper
		this.renderer.appWrapper = $appWrapperElem.nativeElement;
		this.renderer.canvasWrapper = $canvasWrapperElem.nativeElement;
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
		this.renderer.colorBuffer = document.createElement('canvas');

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
		this.renderer.ctx.colorBuffer = this.renderer.colorBuffer.getContext('2d');

		// Debugger
		this.renderer.debugger = document.createElement('canvas');
		this.renderer.ctx.debugger = this.renderer.debugger.getContext('2d');
	}

	undo(): void {
		const drawOrErase: number = this.oekakiOrder[this.orderId];

		if (drawOrErase === undefined) return;

		if (drawOrErase === 1 && this.drawId > -1) {
			// draw
			this._updateDraw(this.drawId, false);

			let dId: number = this.drawId;
			dId -= dId > -1 ? 1 : 0;
			this.drawId = dId;
		} else if (drawOrErase === 0 && this.eraseId > -1) {
			// erase
			this._updateErase(this.eraseId);

			let eId: number = this.eraseId;
			eId -= eId > -1 ? 1 : 0;
			this.eraseId = eId;
		}

		let oId: number = this.orderId;
		oId -= oId > -1 ? 1 : 0;
		this.orderId = oId;
	}

	redo(): void {
		let oId: number = this.orderId;
		oId += oId < this.oekakiOrder.length - 1 ? 1 : 0;

		const drawOrErase: number = this.oekakiOrder[oId];

		if (drawOrErase === undefined) return;

		if (drawOrErase === 1 && this.drawId < this.trailList.length - 1) {
			// draw
			let dId: number = this.drawId;
			dId += dId < this.trailList.length - 1 ? 1 : 0;

			this._updateDraw(dId, true);
			this.drawId = dId;
		} else if (drawOrErase === 0 && this.eraseId < this.eraseList.length - 1) {
			// erase
			let eId: number = this.eraseId;
			eId += eId < this.eraseList.length - 1 ? 1 : 0;

			this._updateErase(eId);
			this.eraseId = eId;
		}

		this.orderId = oId;
	}

	private _updateDraw($dId: number, $flg: boolean): void {
		const trail: Trail = this.trailList[$dId];
		trail.visibility = $flg;
	}

	private _updateErase($eId: number): void {
		const erase: Erase = this.eraseList[$eId];
		const trailList: Erase['trailList'] = erase.trailList;

		for (let i = 0; i < trailList.length; i++) {
			if (!trailList[i]) continue;

			const tId: number = trailList[i].trailId;
			const trail: Trail = this.trailList[tId];
			const pointList: number[] = trailList[i].pointIdList;

			for (let j = 0; j < pointList.length; j++) {
				const pId: number = pointList[j];
				const point: Point = trail.points[pId];

				if (!trail || !point) continue;

				point.visibility = !point.visibility;
			}
		}
	}

	pileNewHistory(): void {
		// Remove unnecessary event ids
		this.oekakiOrder = _.take(this.oekakiOrder, this.orderId + 1);

		if (this.reservedByFunc.current.type === 'draw') {
			this._newDrawHistory();
		} else if (this.reservedByFunc.current.type === 'erase') {
			this._newEraseHistory();
		}

		this.orderId++;
		this.states.isChangedStates = true;
	}

	private _newDrawHistory(): void {
		this.trailList = _.take(this.trailList, this.drawId + 1);

		const trail: Trail = {
			id: this.trailList.length,
			colorId: this.lib.genUniqueColor(this.colorIdList),
			name: this.reservedByFunc.current.name,
			visibility: true,
			min: {
				x: Infinity,
				y: Infinity
			},
			max: {
				x: -Infinity,
				y: -Infinity
			},
			origin: {
				prevOffsetX: (this.pointerOffset.prev.x - this.canvasOffset.prevOffsetX) / this.canvasOffset.zoomRatio,
				prevOffsetY: (this.pointerOffset.prev.y - this.canvasOffset.prevOffsetY) / this.canvasOffset.zoomRatio,
				newOffsetX: (this.pointerOffset.prev.x - this.canvasOffset.prevOffsetX) / this.canvasOffset.zoomRatio,
				newOffsetY: (this.pointerOffset.prev.y - this.canvasOffset.prevOffsetY) / this.canvasOffset.zoomRatio
			},
			points: [] as Point[]
		};
		this.trailList.push(trail);

		// Push new colorId
		this.colorIdList.push({ id: trail.id, colorId: trail.colorId });

		// To tell 'draw'
		this.oekakiOrder.push(1);
		this.drawId++;
	}

	private _newEraseHistory(): void {
		this.eraseList = _.take(this.eraseList, this.eraseId + 1);

		const erase: Erase = {
			id: this.eraseList.length,
			trailList: []
		};
		this.eraseList.push(erase);

		// To tell 'erase'
		this.oekakiOrder.push(0);
		this.eraseId++;
	}
}

interface BrushSizeSlider {
	// Wrapper
	wrapper: HTMLDivElement;
	meter: HTMLDivElement;
}

interface Renderer {
	// Wrapper
	appWrapper: HTMLDivElement;
	canvasWrapper: HTMLDivElement;
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
	colorBuffer: HTMLCanvasElement;
	ctx: Ctx;
}

interface Ctx {
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
	colorBuffer: CanvasRenderingContext2D;
}
