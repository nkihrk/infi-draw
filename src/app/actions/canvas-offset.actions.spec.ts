import * as fromCanvasOffset from './canvas-offset.actions';

describe('loadCanvasOffsets', () => {
  it('should return an action', () => {
    expect(fromCanvasOffset.loadCanvasOffsets().type).toBe('[CanvasOffset] Load CanvasOffsets');
  });
});
