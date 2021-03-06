import { AnyAction } from 'redux';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { ActionType } from 'typesafe-actions';

import * as models from './models';
import * as actions from './actions';
import * as utils from './utils';
import * as constants from './constants';
import * as CommonConstants from '../../redux/constants';
import StoreManager from '../StoreManager/component';

export type IpfsStorageActions = ActionType<typeof actions>;

const setEntryUploadedEpic: Epic<AnyAction> = (action$, state$) => action$.pipe(
  ofType(constants.CLIENT_UPLOADS_LIST_ENTRY_SET_UPLOADED),
  map((action) => {
    const { uploads } = state$.value.ipfsStorage;
    const { entryId, hash } = action.payload;
    const entityIsRead = state$.value.isOpen.loader && state$.value.loader.activeTab === CommonConstants.LOADER_TAB_UPLOAD;

    try {
      const foundEntry = uploads.find((entry: models.UploadsFileEntry) => entry.id === entryId);
      if (!foundEntry) {
        throw Error(`Entry with id=${entryId} does not exist in state.ipfsStorage.uploads`);
      }

      const entry = utils.createUploadedFileEntry(foundEntry, hash, entityIsRead);
      StoreManager.store.dispatch(actions.uploadsListEntryDelete(entryId));
      return actions.uploadedListFileAdd(entry);
    } catch (error) {
      return actions.uploadsListEntrySetUploadedError(entryId, error);
    }
  }),
);

const setEntryDownloadedEpic: Epic<AnyAction> = (action$, state$) => action$.pipe(
  ofType(constants.CLIENT_DOWNLOAD_LIST_ENTRY_SET_DOWNLOADED),
  map((action) => {
    const { downloads } = state$.value.ipfsStorage;
    const { entryId, file } = action.payload;
    const entityIsRead = state$.value.isOpen.loader && state$.value.loader.activeTab === CommonConstants.LOADER_TAB_DOWNLOAD;

    try {
      const foundEntry = downloads.find((entry: models.DownloadFileEntry) => entry.id === entryId);
      if (!foundEntry) {
        throw Error(`Entry with id=${entryId} does not exist in state.ipfsStorage.uploads`);
      }

      const entry = utils.createDownloadedFileEntry(foundEntry, file, entityIsRead);
      StoreManager.store.dispatch(actions.downloadListEntryDelete(entryId));
      return actions.downloadedListFileAdd(entry);
    } catch (error) {
      return actions.downloadListEntrySetDownloadedError(entryId, error);
    }
  }),
);

export default combineEpics(
  setEntryUploadedEpic,
  setEntryDownloadedEpic,
);
