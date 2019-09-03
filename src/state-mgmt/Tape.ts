import _ from 'lodash';
import { Action } from './actions';
import * as A from './actions';
import { State } from './state';
import { isInEditMode } from './Mode';

export interface TapeState {
  entries: string[];
  center: number;
}

export const initTapeState: TapeState = {
  entries: ['a', 'b', 'c', '', '', '', 'x', 'y', 'z', '', '', '', '(', '$', ')'],
  center: 7,
};

// Return an array containing all of the tape entries, along with entries
// containing empty values for nonexistent intermediate entries.
export const tapeEntries = (state: State): string[] => state.entities.tape.entries;

export const tapeCenter = (state: State): number => state.entities.tape.center;

export const tapeReducer = (state: State, action: Action): TapeState => {
  if (isInEditMode(state)) {
    switch (action.type) {
      case A.SET_TAPE_CENTER:
        return setTapeCenter(state, action.payload.pos);
      case A.CHANGE_TAPE_CELL:
        return changeTapeCell(state, action.payload.pos, action.payload.value);
      default:
        return state.entities.tape;
    }
  }
  else {
    return state.entities.tape;
  }
};

const setTapeCenter = (state: State, pos: number): TapeState => ({
  ...state.entities.tape,
  center: pos,
});

const changeTapeCell = (state: State, pos: number, value: string): TapeState => ({
  ...state.entities.tape,
  entries: _.update(_.clone(state.entities.tape.entries), pos, _ => value),
});
