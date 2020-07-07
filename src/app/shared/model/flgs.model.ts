export interface Flgs {
  dblClickFlg: boolean;
  downFlg: boolean;
  // - Similarly to mousedown events
  leftDownFlg: boolean;
  middleDownFlg: boolean;
  rightDownFlg: boolean;
  // - Similarly to mouseup events
  leftUpFlg: boolean;
  middleUpFlg: boolean;
  rightUpFlg: boolean;
  // - Similarly to mousedown + mousemove events
  leftDownMoveFlg: boolean;
  middleDownMoveFlg: boolean;
  rightDownMoveFlg: boolean;
  // - Similarly to wheel event
  wheelFlg: boolean;
}
