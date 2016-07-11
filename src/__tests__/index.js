import {expect} from 'chai';
import createReducer from '../';

describe('modux/createReducer', () => {
  var reducer;

  const initialState = {
    name: 'test',
    deepKey: {
      value: ['test2'],
      test: {t1: 't1'}
    }
  };

  describe('the resulting reducer', () => {
    before(() => {
      reducer = createReducer('NAME_SPACE', initialState, {
        ADDITIONAL_ACTION: (state, {payload}) => ({additionalContent: payload})
      });
    });

    it('should set the initial state correctly', () => {
      expect(reducer(undefined, {type: '@@INIT'})).to.eql(initialState);
    });

    it('should respond to the additional action', () => {
      const actual = reducer(undefined, {
        type: 'ADDITIONAL_ACTION',
        payload: ['test']
      });

      expect(actual).to.eql({additionalContent: ['test']});
    });

    it('should respond to unknown actions based on namespace', () => {
      const actual = reducer(undefined, {
        type: 'NAME_SPACE/ADDITIONAL_ACTION',
        payload: {name: 'new Name'}
      });

      expect(actual).to.eql({
        name: 'new Name',
        deepKey: {
          value: ['test2'],
          test: {t1: 't1'}
        }
      });
    });

    describe('the commit action', () => {
      const type = 'NAME_SPACE/COMMIT';

      describe('when passed a function as payload', () => {
        it('should call it with the state and completely overwrite the state', () => {
          const actual = reducer(undefined, {
            type,
            payload(state) {
              return {
                different: {
                  value: state.deepKey.value[0]
                },
                test: 'name'
              };
            }
          });

          expect(actual).to.eql({
            different: {
              value: 'test2'
            },
            test: 'name'
          });
        });
      });

      describe('when passed an object', () => {
        it('should immutably deep merge the object into the state', () => {
          const actual = reducer(undefined, {
            type,
            payload: {
              flat: 'square',
              deepKey: {
                nested: 'value',
                value: ['test333']
              }
            }
          });

          expect(actual).to.eql({
            name: 'test',
            flat: 'square',
            deepKey: {
              nested: 'value',
              value: ['test333'],
              test: {t1: 't1'}
            }
          });
        });
      });

      context('when passed a path attribute', () => {
        context('when a commitPath is provided', () => {
          describe('when passed a function as payload', () => {
            it('should overwrite the state at the correct path', () => {
              const actual = reducer(undefined, {
                type,
                path: 'deepKey.test',
                payload(state) {
                  return {
                    different: {
                      value: state.t1
                    }
                  };
                }
              });

              expect(actual).to.eql({
                name: 'test',
                deepKey: {
                  value: ['test2'],
                  test: {different: {value: 't1'}}
                }
              });
            });
          });

          describe('when passed an object', () => {
            it('should immutably deep merge the object into the state', () => {
              const actual = reducer(undefined, {
                type,
                path: 'deepKey.test',
                payload: {
                  t2: 't2'
                }
              });

              expect(actual).to.eql({
                name: 'test',
                deepKey: {
                  value: ['test2'],
                  test: {
                    t1: 't1',
                    t2: 't2'
                  }
                }
              });
            });
          });
        });
      });
    });
  });
});
