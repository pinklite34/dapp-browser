import { action } from 'typesafe-actions';
import * as constants from './constants';

export const storageSave = (entry: { key: string, value: string }) => action(constants.STORAGE_SAVE, entry);

export const saveSuccess = (entry: {key: string, value: string}, targetUUID?: string) =>
  action(constants.STORAGE_SAVE_SUCCESS, entry, { targetUUID });

export const saveFailure = (error: string, targetUUID: string) =>
  action(constants.STORAGE_SAVE_FAILURE, error, { targetUUID });

export const storageRemove = (key: string) => action(constants.STORAGE_REMOVE, key);

export const removeSuccess = (key: string, targetUUID?: string) =>
  action(constants.STORAGE_REMOVE_SUCCESS, key, { targetUUID });

export const removeFailure = (error: string, targetUUID: string) =>
  action(constants.STORAGE_REMOVE_FAILURE, error, { targetUUID });

export const storageFindAll = () => action(constants.STORAGE_FIND_ALL);

export const findAllSuccess = (result: any, targetUUID?: string) =>
  action(constants.STORAGE_FIND_ALL_SUCCESS, result, { targetUUID });

export const findAllFailure = (error: string, targetUUID: string) =>
  action(constants.STORAGE_FIND_ALL_FAILURE, error, { targetUUID });
