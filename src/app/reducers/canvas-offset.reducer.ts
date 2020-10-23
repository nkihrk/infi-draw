import { Action, createReducer, on } from '@ngrx/store';
import { CanvasOffset } from '../shared/model/canvas-offset.model';
import * as action from '../actions/canvas-offset.actions';
import * as coord from '../util/coord.util';

export const canvasOffsetFeatureKey = 'canvasOffset';

export interface State extends CanvasOffset {}

export const initialState: State = {
	zoomRatio: 1,
	prevOffsetX: 0,
	prevOffsetY: 0,
	newOffsetX: 0,
	newOffsetY: 0
};

const _canvasOffsetReducer = createReducer(
	initialState,
	on(action.updateCanvasOffset, (state, canvasOffset) => canvasOffset),
	on(action.updateCanvasOffsetNewOffset, (state, data) => {
		const newOffset: { x: number; y: number } = coord.updateOffset(state, data);
		return { ...state, newOffsetX: newOffset.x, newOffsetY: newOffset.y };
	}),
	on(action.updateCanvasOffsetNewOffsetNoRestrict, (state, data) => {
		const newOffset: { x: number; y: number } = coord.updateOffsetWithGivenPoint(state, data);
		return { ...state, newOffsetX: newOffset.x, newOffsetY: newOffset.y };
	}),
	on(action.updateCanvasOffsetPrevOffset, (state) => ({
		...state,
		prevOffsetX: state.newOffsetX,
		prevOffsetY: state.newOffsetY
	})),
	on(action.updateCanvasOffsetZoomRatioByWheel, (state, data) => {
		const zoomRatio: number = coord.updateZoomRatioByWheel(state.zoomRatio, data);
		return { ...state, zoomRatio };
	}),
	on(action.updateCanvasOffsetZoomRatioByPointer, (state, data) => {
		const zoomRatio: number = coord.updateZoomRatioByWheel(state.zoomRatio, data);
		return { ...state, zoomRatio };
	})
);

export function canvasOffsetReducer(state: CanvasOffset | undefined, action: Action) {
	return _canvasOffsetReducer(state, action);
}
