import { Point } from './point.model';
import { Offset } from './offset.model';

export interface Trail {
	id: number;
	colorId: string;
	name: string;
	visibility: boolean;
	min: Offset;
	max: Offset;
	points: Point[];
}
