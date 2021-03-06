import { AnyAction } from 'redux';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import * as path from 'path';

import { getDefaultExecPath, Keychain } from '../systemComponents/Keychain';
import * as keychainActions from '../actions/keychain';
import * as constants from '../constants';

const KEYCHAIN_PATH = path.join(__dirname, '..', 'helpers', 'systemComponents', 'Keychain', getDefaultExecPath());

const keychainCreateEpic: Epic<AnyAction> = action$ => action$.pipe( // @todo fix action type
  ofType(constants.KEYCHAIN_CREATE),
  mergeMap(async (action) => {
    try {
      const key = action.payload.key;
      const cipher = Keychain.Cipher.AES256; // todo do we need to pass 'cipher' and 'curve' parameters from a dapp?
      const curve = Keychain.Curve.SECP256K1;
      const keychainInstance = new Keychain(KEYCHAIN_PATH);

      const result = await keychainInstance.create(key, cipher, curve);
      return keychainActions.createSuccess(result, action.meta.sourceUUID);
    } catch (error) {
      return keychainActions.createFailure(error, action.meta.sourceUUID);
    }
  }),
);

const keychainListEpic: Epic<AnyAction> = action$ => action$.pipe( // @todo fix action type
  ofType(constants.KEYCHAIN_LIST),
  mergeMap(async (action) => {
    try {
      const keychainInstance = new Keychain(KEYCHAIN_PATH);

      const result = await keychainInstance.list();
      return keychainActions.listSuccess(result, action.meta.sourceUUID);
    } catch (error) {
      return keychainActions.listFailure(error, action.meta.sourceUUID);
    }
  }),
);

const keychainLockEpic: Epic<AnyAction> = action$ => action$.pipe( // @todo fix action type
  ofType(constants.KEYCHAIN_LOCK),
  mergeMap(async (action) => {
    try {
      const keychainInstance = new Keychain(KEYCHAIN_PATH);

      const result = await keychainInstance.lock();
      return keychainActions.lockSuccess(result, action.meta.sourceUUID);
    } catch (error) {
      return keychainActions.lockFailure(error, action.meta.sourceUUID);
    }
  }),
);

const keychainSignEpic: Epic<AnyAction> = (action$, state$) => action$.pipe( // @todo fix action type
  ofType(constants.KEYCHAIN_SIGN),
  mergeMap(async (action) => {
    try {
      const key = `${state$.value.client.keychain.selectedKey}`; // keys consitsted only of numbers throw 'Bad cast' exception. Converting everythin to string
      // const chainId = action.payload.chainId;
      const transaction = action.payload.transaction;
      const keychainInstance = new Keychain(KEYCHAIN_PATH);

      const result = await keychainInstance.sign(key, '', transaction);
      return keychainActions.signSuccess(result, action.meta.uid, action.meta.sourceUUID);
    } catch (error) {
      return keychainActions.signFailure(error, action.meta.uid, action.meta.sourceUUID);
    }
  }),
);

const keychainPubliKeyEpic: Epic<AnyAction> = (action$, state$) => action$.pipe( // @todo fix action type
  ofType(constants.KEYCHAIN_PUBLIC_KEY),
  mergeMap(async (action) => {
    try {
      const key = `${state$.value.client.keychain.selectedKey}`; // keys consitsted only of numbers throw 'Bad cast' exception. Converting everythin to string
      const keychainInstance = new Keychain(KEYCHAIN_PATH);

      const result = await keychainInstance.publicKey(key);
      return keychainActions.publicKeySuccess(result, action.meta.uid, action.meta.sourceUUID);
    } catch (error) {
      return keychainActions.publicKeyFailure(error, action.meta.uid, action.meta.sourceUUID);
    }
  }),
);

const keychainUnlockEpic: Epic<AnyAction> = (action$, state$) => action$.pipe( // @todo fix action type
  ofType(constants.KEYCHAIN_UNLOCK),
  mergeMap(async (action) => {
    try {
      const key = `${state$.value.client.keychain.selectedKey}`; // keys consitsted only of numbers throw 'Bad cast' exception. Converting everythin to string
      const keychainInstance = new Keychain(KEYCHAIN_PATH);

      const result = await keychainInstance.unlock(key);
      return keychainActions.unlockSuccess(result, action.meta.sourceUUID);
    } catch (error) {
      return keychainActions.unlockFailure(error, action.meta.sourceUUID);
    }
  }),
);

export default combineEpics(
  keychainCreateEpic,
  keychainListEpic,
  keychainSignEpic,
  keychainLockEpic,
  keychainUnlockEpic,
  keychainPubliKeyEpic,
);
