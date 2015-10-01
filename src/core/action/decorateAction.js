import { isAction, actionName } from '../utils/symbols';

let decorateAction = ([ action, options ]) =>
  [ Object.assign(action, {
    [isAction]: true,
    [actionName]: options[actionName],
    listen: f => action.onValue(f),
    listenAndPromise: f => {
      if (!options.asyncResult)
        throw new Error('Cannot `listenAndPromise` on a synchronous action!');
      action.mapPromise(f)
        .onValue(action.completed)
        .onError(action.failed);
    }
  }), options ];

export default decorateAction;
