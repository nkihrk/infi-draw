import { Action, createReducer, on } from '@ngrx/store';
import { Flgs } from '../shared/model/flgs.model';
import * as action from '../actions/flgs.actions';

export const flgsFeatureKey = 'flgs';

export interface State extends Flgs {}

export const initialState: State = {
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

const reducer = createReducer(initialState);

const _flgsReducer = createReducer(
	initialState,
	on(action.updateFlgs, (state, flgs) => ({ ...flgs }))
);

export function flgsReducer(state: Flgs | undefined, action: Action) {
	return _flgsReducer(state, action);
}
