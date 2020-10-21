import { createFeatureSelector, createSelector } from '@ngrx/store';
import { flgsFeatureKey } from '../reducers/flgs.reducer';
import { Flgs } from '../shared/model/flgs.model';

export const selectFlgsState = createFeatureSelector<Flgs>(flgsFeatureKey);
//export const selectFlgs = createSelector(selectFlgsState, (state) => state);
