import { action } from 'typesafe-actions';
import * as uuidv4 from 'uuid/v4';

import * as constants from '../constants';

export const openChannelIntent = () => action(constants.INTENT_OPEN_CHANNELS);

export const showFileEntries = () => action(constants.SHOW_FILE_ENTRIES);

export const networkGetBlock = () => action(constants.NETWORK_GET_BLOCK);
export const getBlockSuccess = (block: string, targetUUID?: string) =>
  action(constants.NETWORK_GET_BLOCK_SUCCESS, block, targetUUID);
export const getBlockFailure = (error: string, targetUUID?: string) =>
  action(constants.NETWORK_GET_BLOCK_FAILURE, error, targetUUID);
export const networkGetWitness = (witnessId: string) => action(constants.NETWORK_GET_WITNESS, { witnessId });

export const networkSubscribe = () => action(constants.NETWORK_SUBSCRIBE);
export const networkSubscribeSuccess = (result: any, targetUUID?: string) =>
  action(constants.NETWORK_SUBSCRIBE_SUCCESS, { result }, targetUUID);
export const networkSubscribeFailure = (error: string, targetUUID?: string) =>
  action(constants.NETWORK_SUBSCRIBE_FAILURE, error, targetUUID);

export const networkUnsubscribe = () => action(constants.NETWORK_UNSUBSCRIBE);
export const networkUnsubscribeSuccess = (result: any, targetUUID?: string) =>
  action(constants.NETWORK_UNSUBSCRIBE_SUCCESS, { result }, targetUUID);
export const networkUnsubscribeFailure = (error: string, targetUUID?: string) =>
  action(constants.NETWORK_UNSUBSCRIBE_FAILURE, error, targetUUID);

export const writeToConsole = (message: string) => action(constants.LOGGER_WRITE, { message });
export const loggerWriteSuccess = (result: any, targetUUID?: string) =>
  action(constants.LOGGER_WRITE_SUCCESS, { result }, targetUUID);
export const loggerWriteFailure = (error: string, targetUUID?: string) =>
  action(constants.LOGGER_WRITE_FAILURE, error, targetUUID);

export const showBlock = () => action(constants.SHOW_BLOCK);

export const keychainCreate = (key: string, cipher: string, curve: string) =>
  action(constants.KEYCHAIN_CREATE, { key, cipher, curve });

export const keychainList = () => action(constants.KEYCHAIN_LIST);

export const keychainPublicKey = () => action(constants.KEYCHAIN_PUBLIC_KEY);
export const keychainPublicKeySuccess = (result: any, targetUUID?: string) =>
  action(constants.KEYCHAIN_PUBLIC_KEY_SUCCESS, {result}, targetUUID);
export const keychainPublicKeyFailure = (error: string, targetUUID?: string) =>
  action(constants.KEYCHAIN_PUBLIC_KEY_FAILURE, error, targetUUID);

export const keychainSign = (transaction: string) => action(constants.KEYCHAIN_SIGN, { transaction });
export const keychainSignSuccess = (result: any, targetUUID?: string) =>
  action(constants.KEYCHAIN_SIGN_SUCCESS, { result }, targetUUID);
export const keychainSignFailure = (error: string, targetUUID?: string) =>
  action(constants.KEYCHAIN_SIGN_FAILURE, error, targetUUID);

export const ethereumBuildTransaction = (signature: string, from: string, to: string, value: number) =>
  action(constants.ETHEREUM_BUILD_TRANSACTION, { signature, from, to, value });
export const ethereumBuildTransactionSuccess = (result: any, targetUUID?: string) =>
  action(constants.ETHEREUM_BUILD_TRANSACTION_SUCCESS, {result}, targetUUID);
export const ethereumBuildTransactionFailure = (error: string, targetUUID?: string) =>
  action(constants.ETHEREUM_BUILD_TRANSACTION_FAILURE, error, targetUUID);

export const ethereumPublishTransaction = (transaction: string) => action(constants.ETHEREUM_PUBLISH_TRANSACTION, { transaction });
export const ethereumPublishTransactionSuccess = (result: any, targetUUID?: string) =>
  action(constants.ETHEREUM_PUBLISH_TRANSACTION_SUCCESS, {result}, targetUUID);
export const ethereumPublishTransactionFailure = (error: string, targetUUID?: string) =>
  action(constants.ETHEREUM_PUBLISH_TRANSACTION_FAILURE, error, targetUUID);

export const ethereumPublicToAddress = (publicKey: string) => action(constants.ETHEREUM_PUBLIC_TO_ADDRESS, { publicKey });
export const ethereumPublicToAddressSuccess = (result: any, targetUUID?: string) =>
  action(constants.ETHEREUM_PUBLIC_TO_ADDRESS_SUCCESS, {result}, targetUUID);
export const ethereumPublicToAddressFailure = (error: string, targetUUID?: string) =>
  action(constants.ETHEREUM_PUBLIC_TO_ADDRESS_FAILURE, error, targetUUID);

export const keychainShowResult = () => action(constants.KEYCHAIN_SHOW_RESULT);

export const toggleAppHomeSuccess = () => action(constants.TOGGLE_APP_HOME_SUCCESS);
