import { Offset } from './offset.model';

export interface Point {
	id: number;
	color: string;
	visibility: boolean;
	relativeOffset: {
		x: number;
		y: number;
	};
	pressure: number;
	lineWidth: number;
}
