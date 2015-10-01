import {
  combine, map, filter,
  filterNot, filterSplit,
  compose, flatten
} from 'fnutil/utils';
import { isAction } from '../utils/symbols';
import { isObject, toArray } from '../utils';

let isActionObject = x => x[isAction];

let checkActionsExist = actions => {
  if (!actions.length) throw new Error('Please supply a `actions` to observe');
  return actions;
};

let getChildActions = compose(
  combine,
  ([ action, children ]) => [ action, children.map(child => action[child]) ],
  action => [ action, (action.children || []) ]
);

let getActions = compose(
  combine,
  map(getChildActions),
  combine,
  filterSplit(
    filter(isActionObject),
    compose(
      flatten,
      map(::Object.values),
      filter(isObject),
      filterNot(isActionObject)
    )
  ),
  checkActionsExist,
  flatten,
  toArray
);

let getStoreActions = ([ pool, store ]) => [ pool, store, getActions(store.actions || []) ];

export default getStoreActions;
