import { Offset } from './offset.model';

export interface Arc {
	color: string;
	visibility: boolean;
	offset: Offset;
	radius: {
		width: number;
		height: number;
	};
	pressure: number;
	lineWidth: number;
	fragment: { visibility: boolean }[];
}
