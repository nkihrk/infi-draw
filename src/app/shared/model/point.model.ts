export interface Point {
  id: number;
  color: string;
  style: string;
  visibility: boolean;
  offsets: {
    prevOffsetX: number;
    prevOffsetY: number;
    newOffsetX: number;
    newOffsetY: number;
  };
  pressure: number;
}
