import { action } from 'typesafe-actions';
import * as constants from '../constants';

export const buildTransactionSuccess = (result: string, uid: string, targetUUID: string) =>
  action(constants.ETHEREUM_BUILD_TRANSACTION_SUCCESS, result, { uid, targetUUID });
export const buildTransactionFailure = (errors: string, uid: string, targetUUID: string) =>
  action(constants.ETHEREUM_BUILD_TRANSACTION_FAILURE, errors, { uid, targetUUID });

export const publishTransactionSuccess = (result: string, uid: string, targetUUID: string) =>
  action(constants.ETHEREUM_PUBLISH_TRANSACTION_SUCCESS, result, { uid, targetUUID });
export const publishTransactionFailure = (errors: string, uid: string, targetUUID: string) =>
  action(constants.ETHEREUM_PUBLISH_TRANSACTION_FAILURE, errors, { uid, targetUUID });

export const publicToAddressSuccess = (result: string, uid: string, targetUUID: string) =>
  action(constants.ETHEREUM_PUBLIC_TO_ADDRESS_SUCCESS, result, { uid, targetUUID });
export const publicToAddressFailure = (errors: string, uid: string, targetUUID: string) =>
  action(constants.ETHEREUM_PUBLIC_TO_ADDRESS_FAILURE, errors, { uid, targetUUID });
