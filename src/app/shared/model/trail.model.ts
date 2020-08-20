import { Point } from './point.model';
import { Offset } from './offset.model';
import { Square } from './square.model';

export interface Trail {
	id: number;
	type: string;
	visibility: boolean;
	min: Offset;
	max: Offset;
	points: Point[];
	square: Square;
}
