export interface History {
  canvasOffsets: {
    zoomRatio: number;
    prevOffsetX: number;
    prevOffsetY: number;
    newOffsetX: number;
    newOffsetY: number;
  };
  isChangedStates: boolean;
}
