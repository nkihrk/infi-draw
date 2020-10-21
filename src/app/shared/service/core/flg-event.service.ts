import { Injectable } from '@angular/core';
import { Flgs } from '../../model/flgs.model';
import { Store } from '@ngrx/store';
import { updateFlgs } from '../../../actions/flgs.actions';

@Injectable({
	providedIn: 'root'
})
export class FlgEventService {
	constructor(private store: Store) {}

	updateFlgs($event: any): void {
		const flgs: Flgs = {
			dblClickFlg: $event.dblClickFlg,
			downFlg: $event.downFlg,
			// - Similarly to mousedown events
			leftDownFlg: $event.downFlg && !$event.moveFlg && $event.btn === 0,
			middleDownFlg: $event.downFlg && !$event.moveFlg && $event.btn === 1,
			rightDownFlg: $event.downFlg && !$event.moveFlg && $event.btn === 2,
			// - Similarly to mouseup events
			leftUpFlg: !$event.downFlg && !$event.moveFlg && $event.btn === 0,
			middleUpFlg: !$event.downFlg && !$event.moveFlg && $event.btn === 1,
			rightUpFlg: !$event.downFlg && !$event.moveFlg && $event.btn === 2,
			// - Similarly to mousedown + mousemove events
			leftDownMoveFlg: $event.downFlg && $event.moveFlg && $event.btn === 0,
			middleDownMoveFlg: $event.downFlg && $event.moveFlg && $event.btn === 1,
			rightDownMoveFlg: $event.downFlg && $event.moveFlg && $event.btn === 2,
			// Similarly to wheel event
			wheelFlg: $event.wheelFlg
		};

		this.store.dispatch(updateFlgs(flgs));
	}
}
