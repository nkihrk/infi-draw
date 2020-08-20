import { Offset } from './offset.model';

export interface Square {
	width: number;
	height: number;
	offset: Offset;
	lineWidth: number;
	color: string;
	visibility: boolean;
}
