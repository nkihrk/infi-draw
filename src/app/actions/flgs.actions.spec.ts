import * as fromFlgs from './flgs.actions';

describe('loadFlgss', () => {
  it('should return an action', () => {
    expect(fromFlgs.loadFlgss().type).toBe('[Flgs] Load Flgss');
  });
});
