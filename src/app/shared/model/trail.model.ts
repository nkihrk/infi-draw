import { Point } from './point.model';
import { Offset } from './offset.model';

export interface Trail {
	id: number;
	colorId: string;
	name: string;
	visibility: boolean;
	min: { x: number; y: number };
	max: { x: number; y: number };
	origin: Offset;
	points: Point[];
}
