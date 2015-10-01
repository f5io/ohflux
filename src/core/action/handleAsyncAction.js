import createAction from '../../createAction';
import { actionName } from '../utils/symbols';
import { concat, uniq } from 'fnutil/utils';

const DEFAULT_ASYNC_HANDLERS = [ 'completed', 'failed' ];

let getChildActions = (name) => compose(
  reduceChildrenIntoActionsObject(name),
  uniq,
  concat(DEFAULT_ASYNC_HANDLERS)
);

let reduceChildrenIntoActionsObject = name => children => {
  let output = { children };
  let childActions = children.reduce((acc, child) => {
    acc[child] = createAction(`${name}${toSentenceCase(child)}`);
    return acc;
  }, {});
  return { ...output, ...childActions };
}

let handleAsyncAction = ([ action, options ]) =>
  !options.asyncResult ? action : Object.assign(action, {
    ...getChildActions(options[actionName])(options.children || [])
  });

export default handleAsyncAction;
