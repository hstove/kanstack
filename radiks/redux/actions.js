import * as Constants from './constants';
import { decryptObject } from '../helpers';

const savingModel = model => ({
  type: Constants.SAVING_MODEL,
  model,
});

const savedModel = model => ({
  type: Constants.SAVED_MODEL,
  model,
});

const fetchingModels = model => ({
  type: Constants.FETCHING_MODELS,
  model,
});

const fetchedModels = (modelName, models) => ({
  type: Constants.FETCHED_MODELS,
  name: modelName,
  models,
});

const saveModel = model => async function innerSaveModel(dispatch) {
  dispatch(savingModel(model));
  const [file, items] = await model.save();
  console.log(file, items);
  dispatch(savedModel(model));
};

const fetch = Model => async function innerFetch(dispatch) {
  dispatch(fetchingModels(Model));
  const { models } = await Model.fetch();
  console.log(models);
  const decryptedModels = models.map((object) => {
    const decrypted = decryptObject(object, Model);
    console.log(decrypted);
    return new Model(decrypted);
  });
  console.log(decryptedModels);
  dispatch(fetchedModels(Model.schema.name, decryptedModels));
};

export default {
  saveModel,
  fetch,
};
