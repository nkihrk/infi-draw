import { createAction, props } from '@ngrx/store';
import { Flgs } from '../shared/model/flgs.model';

export const updateFlgs = createAction('[FlgEvent Service] update flgs', props<Flgs>());
