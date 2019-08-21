import { Middleware } from 'redux';
import uuid from 'uuid/v4';
import * as actions from './actions';
import { isAddingNode, mouseInfo } from './selectors';

export const addNode: Middleware = api => next => action => {
  if (action.type !== actions.MOUSE_UP_CANVAS) return next(action);

  const state = api.getState();
  if (!isAddingNode(state)) return next(action);

  const id = uuid();
  const { x, y } = mouseInfo(state);

  return next(actions.addNode(id, x, y));
};
