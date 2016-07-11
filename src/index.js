import updeep from 'updeep';
import get from 'lodash/get';

function updateState(state, payload) {
  if (typeof payload === 'function') {
    return payload(state);
  }

  return updeep(payload, state);
}

function updateStateAtPath(state, payload, path) {
  if (typeof payload === 'function') {
    return updeep.updateIn(
      path,
      updeep.constant(
        payload(get(state, path))
      ),
      state
    );
  }

  return updeep.updateIn(path, payload, state);
}

function defaultReducer(state, {payload, path = null}) {
  if (path !== null) {
    return updateStateAtPath(state, payload, path);
  }

  return updateState(state, payload);
}


export default function createReducer(namespace, initialState, handlers = {}) {
  const namespaceRegexp = new RegExp(`^${namespace}/`);

  return function (state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else if (namespaceRegexp.test(action.type)) {
      return defaultReducer(state, action);
    }

    return state;
  };
}
