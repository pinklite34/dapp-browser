import { AnyAction } from 'redux';
import * as uuid from 'uuid/v4';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { map } from 'rxjs/operators';

import * as constants from './constants';
import { showNotification } from './component';
import * as actions from './actions';

import {
  actions as clientActions,
  constants as clientConstants,
} from 'ClientApp/modules/Notification';

import ClientManager from '../../helpers/systemComponents/ClientManager';

const notificationEpic: Epic<AnyAction> = action$ => action$.pipe( // @todo fix action type
  ofType(constants.NOTIFICATIONS_SHOW_NOTIFY),
  map((action) => {
    showNotification(action.payload.options, action.payload.events, action.meta.name);
    return clientActions.addNotification({
      id: uuid(),
      message: action.payload.options.body,
      appName: action.meta.name,
      icon: null,
      created: new Date(),
      onClick: action.payload.events.onClick,
    });
  }),
);

const clientNotificationEpic: Epic<AnyAction> = action$ => action$.pipe( // @todo fix action type
  ofType(clientConstants.CLIENT_NOTIFICATION_TRIGGER_ACTION),
  map((action) => {
    ClientManager.switchDapp(action.meta.appName);
    return actions.triggerAction(action.meta.uid);
  }),
);

export default combineEpics(
  notificationEpic,
  clientNotificationEpic,
);