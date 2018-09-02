import clone from 'lodash/cloneDeep';
import * as Constants from './constants';
// import Board from '../../models/board';

const initialState = {
  models: {},
};

const getNewState = (state, name) => {
  const newState = clone(state);
  newState.models[name] = newState.models[name] || {};
  newState.models[name].byId = newState.models[name].byId || {};
  return newState;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Constants.SAVING_MODEL: {
      const { name } = action.model.schema;
      const newState = getNewState(state, name);
      newState.models[name].currentlySaving = action.model;
      action.model.currentlySaving = true;
      newState.models[name].byId[action.model.uuid] = action.model;
      return {
        ...newState,
      };
    }
    case Constants.SAVED_MODEL: {
      const { name } = action.model.schema;
      const newState = getNewState(state, name);
      newState.models[name].currentlySaving = false;
      action.model.currentlySaving = false;
      newState.models[name].byId[action.model.uuid] = action.model;
      return {
        ...newState,
      };
    }
    case Constants.FETCHED_MODELS: {
      const { name, models } = action;
      const newState = getNewState(state, name);
      newState.models[name].models = models;
      newState.models[name].isFetchingModels = false;
      return {
        ...newState,
      };
    }
    case Constants.FETCHING_MODELS: {
      const { name } = action.model.schema;
      const newState = getNewState(state, name);
      newState.models[name].isFetchingModels = true;
      return {
        ...newState,
      };
    }
    default:
      return state;
  }
};
