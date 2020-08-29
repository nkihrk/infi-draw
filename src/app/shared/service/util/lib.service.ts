import { Injectable } from '@angular/core';
import { Trail } from '../../model/trail.model';
import { PointerOffset } from '../../model/pointer-offset.model';

@Injectable({
	providedIn: 'root'
})
export class LibService {
	constructor() {}

	f2i($num: number): number {
		let rounded: number = (0.5 + $num) | 0;
		rounded = ~~(0.5 + $num);
		rounded = (0.5 + $num) << 0;

		return rounded;
	}

	genUniqueColor($colorsHash: { id: number; colorId: string }[]): string {
		let colorId = '';
		let isUnique = false;

		while (!isUnique) {
			colorId = this._getRandomColor();
			isUnique = colorId.length === 6 && colorId !== '000000';
			if (isUnique) {
				isUnique =
					$colorsHash.filter(($ids: { id: number; colorId: string }) => {
						return $ids.colorId === colorId;
					}).length === 0;
			}
		}

		return colorId;
	}

	// https://css-tricks.com/snippets/javascript/random-hex-color/
	private _getRandomColor(): string {
		return Math.floor(Math.random() * 16777215).toString(16);
	}

	checkHitArea($pointerOffset: PointerOffset, $ctx: CanvasRenderingContext2D, $list: Trail[]): number {
		const pixel = $ctx.getImageData($pointerOffset.current.x, $pointerOffset.current.y, 1, 1).data;
		const hex = this.rgbToHex(pixel[0], pixel[1], pixel[2]);
		const n: number = $list.length;

		for (let i = n - 1; i > -1; i--) {
			if (hex === $list[i].colorId) return i;
		}

		return -1;
	}

	rgbToHex(r: number, g: number, b: number): string {
		if (r > 255 || g > 255 || b > 255) console.log('Failed to convert RGB into HEX : ', r, g, b);
		return ((r << 16) | (g << 8) | b).toString(16);
	}
}
