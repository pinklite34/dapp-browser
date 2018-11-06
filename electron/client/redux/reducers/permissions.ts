import * as constants from '../constants';
import { ActionType } from 'typesafe-actions';
import * as permissionActions from '../actions/permissions';
import { Permission } from './state';
import { togglePermissions } from '../../../main/helpers/reducers/common';

interface PermissionsPanel {
  permissions: { [index:string]: Permission[] };
}

export type PermissionPanelAction = ActionType<typeof permissionActions>;

export default function permissions(state: PermissionsPanel = { permissions: {} }, action: PermissionPanelAction) {
  switch (action.type) {
    case constants.TOGGLE_PERMISSION: {
      const statePermissions = state.permissions;
      const permissions = togglePermissions(action, statePermissions);

      return { ...state, permissions };
    }

    default:
      return state;
  }
}
