import { Action } from '../actions';
import * as actions from '../actions';
import * as nodes from './nodes';

export interface State {
  entities: Entities;
  ui: UiInfo;
}

export interface Entities {
  nodes: NodeEntities;
}

export interface NodeEntities {
  wip: null | NodeInfo;
  committed: NodeInfo;
}

export interface NodeInfo {
  byId: { [key: string]: Node };
  selected: string[];
  offsets: null | NodeOffset[];
}

export interface NodeOffset {
  id: string;
  offsetX: number;
  offsetY: number;
}

export interface Node {
  id: string;
  x: number;
  y: number;
}

export interface UiInfo {
  isMultiSelect: boolean;
  isMouseDown: boolean;
  isAddingNode: boolean;
  mouse: MouseInfo;
}

export interface MouseInfo {
  x: number;
  y: number;
}

const initState: State = {
  entities: {
    nodes: {
      wip: null,
      committed: {
        byId: {
          'q0': {
            id: 'q0',
            x: 300,
            y: 150,
          },
          'q1': {
            id: 'q1',
            x: 500,
            y: 310,
          },
          'q2': {
            id: 'q2',
            x: 40,
            y: 360,
          },
        },
        selected: [],
        offsets: null,
      },
    },
  },
  ui: {
    isMultiSelect: false,
    isMouseDown: false,
    isAddingNode: false,
    mouse: { x: 0, y: 0 },
  },
};

const reduce = (state: State=initState, action: Action): State => {
  switch (action.type) {
    case actions.MOUSE_UP_CANVAS:
      return mouseUpCanvas(state);
    case actions.MOUSE_UP_NODE:
      return mouseUpNode(state);
    case actions.MOUSE_DOWN_NODE:
      return mouseDownNode(state, action);
    case actions.MOUSE_DOWN_CANVAS:
      return mouseDownCanvas(state, action);
    case actions.MOUSE_MOVE:
      return mouseMove(state, action);
    case actions.KEY_DOWN:
      return keyDown(state, action);
    case actions.KEY_UP:
      return keyUp(state, action);
    case actions.REMOVE_SELECTED_NODES:
      return removeSelectedNodes(state);
    case actions.BEGIN_ADD_NODE:
      return beginAddNode(state);
    case actions.ADD_NODE:
      return addNode(state, action);
    default:
      return state;
  }
};

const mouseUpCanvas = (state: State): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.mouseUpCanvas(state),
  },
  ui: {
    ...state.ui,
    isMouseDown: false,
  },
});

const mouseUpNode = (state: State): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.mouseUpNode(state),
  },
  ui: {
    ...state.ui,
    isMouseDown: false,
  },
});

const mouseDownNode = (state: State, action: Action): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.mouseDownNode(state, action.payload.id),
  },
  ui: {
    ...state.ui,
    isMouseDown: true,
  },
});

const mouseDownCanvas = (state: State, action: Action): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.mouseDownCanvas(state, action.payload.offsetX, action.payload.offsetY),
  },
});

const mouseMove = (state: State, action: Action): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.mouseMove(state, action.payload.offsetX, action.payload.offsetY),
  },
  ui: {
    ...state.ui,
    mouse: { x: action.payload.offsetX, y: action.payload.offsetY },
  },
});

const keyDown = (state: State, action: Action): State => ({
  ...state,
  ui: {
    ...state.ui,
    isMultiSelect: action.payload.key === 'Shift' || state.ui.isMultiSelect,
  },
});

const keyUp = (state: State, action: Action): State => ({
  ...state,
  ui: {
    ...state.ui,
    isMultiSelect: action.payload.key === 'Shift' ? false : state.ui.isMultiSelect,
  },
});

const removeSelectedNodes = (state: State): State => ({
  ...state,
  entities: {
    ...state.entities,
    nodes: nodes.removeSelectedNodes(state),
  },
});

const beginAddNode = (state: State): State => ({
  ...state,
  ui: {
    ...state.ui,
    isAddingNode: true,
  },
});

const addNode = (state: State, action: Action): State => {
  const { id, x, y } = action.payload;
  return {
    ...state,
    entities: {
      ...state.entities,
      nodes: nodes.addNode(state, id, x, y),
    },
    ui: {
      ...state.ui,
      isAddingNode: false,
    },
  };
};

export default reduce;
