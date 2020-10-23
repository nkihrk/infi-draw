import { Offset } from '../shared/model/offset.model';
import { PointerOffset } from '../shared/model/pointer-offset.model';
import { Pointer } from '../shared/model/pointer.model';

interface NewOffset {
	x: number;
	y: number;
}

interface States {
	isPreventSelect: boolean;
	isPreventTrans: boolean;
}

export function updateOffset(
	$offset: Offset,
	$data: {
		newOffsetX: number;
		newOffsetY: number;
		event: Pointer;
		pointerOffset: PointerOffset;
		states: States;
		wheelFlg: boolean;
		zoomSpeed: number;
	}
): NewOffset {
	let offsetX: number = $offset.prevOffsetX;
	let offsetY: number = $offset.prevOffsetY;

	if (!$data.wheelFlg) {
		if (
			($data.event.btn === 0 && !$data.states.isPreventSelect) ||
			($data.event.btn === 1 && !$data.states.isPreventTrans)
		) {
			offsetX += $data.newOffsetX;
			offsetY += $data.newOffsetY;
		}
	} else {
		offsetX -= $data.pointerOffset.current.x;
		offsetY -= $data.pointerOffset.current.y;

		if ($data.event.delta > 0) {
			const ratio: number = 1 - $data.zoomSpeed;
			offsetX = offsetX * ratio + $data.pointerOffset.current.x;
			offsetY = offsetY * ratio + $data.pointerOffset.current.y;
		} else {
			const ratio: number = 1 + $data.zoomSpeed;
			offsetX = offsetX * ratio + $data.pointerOffset.current.x;
			offsetY = offsetY * ratio + $data.pointerOffset.current.y;
		}
	}

	return { x: offsetX, y: offsetY };
}

export function updateOffsetWithGivenPoint(
	$offset: Offset,
	$data: {
		x: number;
		y: number;
		deltaFlg: boolean;
		zoomSpeed: number;
	}
): NewOffset {
	let offsetX: number = $offset.prevOffsetX;
	let offsetY: number = $offset.prevOffsetY;

	offsetX -= $data.x;
	offsetY -= $data.y;

	if ($data.deltaFlg) {
		const ratio: number = 1 - $data.zoomSpeed;
		offsetX = offsetX * ratio + $data.x;
		offsetY = offsetY * ratio + $data.y;
	} else {
		const ratio: number = 1 + $data.zoomSpeed;
		offsetX = offsetX * ratio + $data.x;
		offsetY = offsetY * ratio + $data.y;
	}

	return { x: offsetX, y: offsetY };
}

export function updateZoomRatioByWheel(
	$zoomRatio: number,
	$data: {
		deltaFlg: boolean;
		zoomSpeed: number;
	}
): number {
	let zoomRatio: number = $zoomRatio;

	let ratio = 1;
	if ($data.deltaFlg) {
		// Negative zoom
		ratio -= $data.zoomSpeed;
	} else {
		// Positive zoom
		ratio += $data.zoomSpeed;
	}

	zoomRatio *= ratio;

	return zoomRatio;
}

export function updateZoomRatioByPointer($zoomRatio: number, $deltaFlg: boolean): number {
	let zoomRatio: number = $zoomRatio;

	let ratio = 1;
	if ($deltaFlg) {
		// Negative zoom
		ratio -= this.memory.constant.POINTER_ZOOM_SPEED;
	} else {
		// Positive zoom
		ratio += this.memory.constant.POINTER_ZOOM_SPEED;
	}

	zoomRatio *= ratio;

	return zoomRatio;
}
