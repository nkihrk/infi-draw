import { Point } from './point.model';
import { Offset } from './offset.model';
import { Arc } from './arc.model';

export interface Trail {
	id: number;
	name: string;
	type: string;
	visibility: boolean;
	min: Offset;
	max: Offset;
	points: Point[];
	arc: Arc;
}
