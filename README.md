# redux-updeep

`redux-updeep` is a small reducer generator that uses [updeep](https://github.com/substantial/updeep) to immutably deep merge partial updates into the reducer's state. It's great for reducing boilerplate in your redux actions and reducers!

## Installation

`redux-updeep` is available on npm:

```bash
npm install redux-updeep
```


## Getting started

### 1. Create your reducers

```js
import createReducer from 'redux-updeep';

const initialState = {
  user: {
    name: 'Alex',
    company: 'Algolia'
  }
};

export default createReducer('MY_REDUCER', initialState);
```

That's it ! No need to specify any actions, `redux-updeep` will take care of it.


### 2. Dispatch actions

In the previous example, `MY_REDUCER` is the namespace of the reducer. The reducer automatically handle any action whose `type` starts with `MY_REDUCER` and immutable deep merge the `payload` of the action into the reducer state.

```js
export function updateName(newName) {
  return {
    type: 'MY_REDUCER/UPDATE_NAME',
    payload: {
      user: {
        name: newName
      }
    }
  };
}
```

```js
dispatch(updateName('Alexandre'))

//  New State:
{
  user: {
    name: 'Alexandre',
    company: 'Algolia'
  }
}
```



## Advanced usage

### Handling Arrays

Deep merging arrays using updeep can lead to surprising behaviour, therefore it's recommended to use [`updeep.constant`](https://github.com/substantial/updeep#uconstantobject) when merging arrays as values.

Updeep provides a number of utility functions which are very useful for handling arrays, for instance [`updeep.reject`](https://github.com/substantial/updeep#urejectpredicate-object).


```js
import createReducer from 'redux-updeep';
import u from 'updeep';

const initialState = {
  user: {
    name: 'Alex',
    company: 'Algolia',
    favoriteColors: ['green', 'rebeccapurple']
  }
};

export default createReducer('MY_REDUCER', initialState);

export function removeFavoriteColor(newFavoriteColors) {
  return {
    type: 'MY_REDUCER/UPDATE_FAVORITE_COLORS',
    payload: {
      user: {
        // Will ensure the new array replaces the previous one instead of merging with it
        favoriteColor: u.constant(newFavoriteColors)
      }
    }
  };
}

export function removeFavoriteColor(colorToRemove) {
  return {
    type: 'MY_REDUCER/REMOVE_FAVORITE_COLOR',
    payload: {
      user: {
        favoriteColor: u.reject(item => item === colorToRemove)
      }
    }
  };
}
```


### Complex actions

Sometimes deep merging partial updates is not enough and we need to perform complex transformations of the state. In this case, it is possible to pass a third argument to the `createReducer` function, which needs to be an object mapping action types to normal reducers.

```js
export default createReducer('MY_REDUCER', initialState, {
  'MY_REDUCER/COMPLEX_ACTION': (state, action) => {
    return complexTransformation(state, action.payload);
  };
})
```


### Specifying a path

It is possible to specify a `path` at which the payload should be merged inside the object. Those paths are the same as the [`_.get`](https://lodash.com/docs#get) paths and can be strings or arrays.

```js
import createReducer from 'redux-updeep';
import {reject} from 'updeep';

const initialState = {
  user: {
    name: 'Alex',
    company: 'Algolia',
  }
};

export default createReducer('MY_REDUCER', initialState);

export function updateName(newName) {
  return {
    type: 'MY_REDUCER/UPDATE_FAVORITE_COLORS',
    payload: newName,
    path: ['user', 'name']
  };
}
```

