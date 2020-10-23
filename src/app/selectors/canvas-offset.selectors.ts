import { createFeatureSelector, createSelector } from '@ngrx/store';
import { canvasOffsetFeatureKey } from '../reducers/canvas-offset.reducer';
import { CanvasOffset } from '../shared/model/canvas-offset.model';

export const selectCanvasOffsetState = createFeatureSelector<CanvasOffset>(canvasOffsetFeatureKey);
