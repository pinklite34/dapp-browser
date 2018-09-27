import { action } from 'typesafe-actions';
import { Action } from 'redux';
import { CLOSE_MANAGER, TOGGLE_PERMISSION } from '../constants';
import { Permission } from '../model';

export interface PermissionAction extends Action {
  payload?: {
    item?: Permission,
    status?: boolean
  }
}

export const closeManager = ():
  PermissionAction => action(CLOSE_MANAGER);

export const togglePermission = (PermissionType: Permission, isApproved: boolean):
  PermissionAction => action(TOGGLE_PERMISSION, {
    item: PermissionType,
    status: isApproved
  });
 