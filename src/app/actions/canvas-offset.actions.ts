import { createAction, props } from '@ngrx/store';
import { CanvasOffset } from '../shared/model/canvas-offset.model';
import { Offset } from '../shared/model/offset.model';
import { Pointer } from '../shared/model/pointer.model';
import { PointerOffset } from '../shared/model/pointer-offset.model';

interface States {
	isPreventSelect: boolean;
	isPreventTrans: boolean;
}

export const updateCanvasOffset = createAction('UPDATE_CANVAS_OFFSET', props<CanvasOffset>());
export const updateCanvasOffsetNewOffset = createAction(
	'UPDATE_CANVAS_OFFSET_NEW_OFFSET',
	props<{
		newOffsetX: number;
		newOffsetY: number;
		event: Pointer;
		pointerOffset: PointerOffset;
		states: States;
		wheelFlg: boolean;
		zoomSpeed: number;
	}>()
);
export const updateCanvasOffsetNewOffsetNoRestrict = createAction(
	'UPDATE_CANVAS_OFFSET_NEW_OFFSET_NO_RESTRICT',
	props<{
		x: number;
		y: number;
		deltaFlg: boolean;
		zoomSpeed: number;
	}>()
);
export const updateCanvasOffsetPrevOffset = createAction('UPDATE_CANVAS_OFFSET_PREV_OFFSET');
export const updateCanvasOffsetZoomRatioByWheel = createAction(
	'UPDATE_CANVAS_OFFSET_ZOOM_RATIO_BY_WHEEL',
	props<{ deltaFlg: boolean; zoomSpeed: number }>()
);
export const updateCanvasOffsetZoomRatioByPointer = createAction(
	'UPDATE_CANVAS_OFFSET_ZOOM_RATIO_BY_POINTER',
	props<{ deltaFlg: boolean; zoomSpeed: number }>()
);
