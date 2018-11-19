import { ofType, Epic, combineEpics } from 'redux-observable';
import { merge, concatMap, ignoreElements, tap, switchMap, mapTo, map } from 'rxjs/operators';
import * as constants from '../constants';
import { AppsManager } from '../AppsManager';
import ClientManager from '../ClientManager';
import * as clientActions from '../actions/client';

const openDappEpic: Epic<any> = action$ => action$.pipe(
  ofType(constants.SWITCH_DAPP),
  tap(action => ClientManager.switchDapp(action.payload.targetDappName)),
  ignoreElements(),
);

const addAppItemEpic: Epic<any> = action$ => action$.pipe(
  ofType(constants.SWITCH_DAPP_SUCCESS),
  map(action => clientActions.addAppItem(AppsManager.getAppItem(action.payload.targetDappName))),
);

const toggleHomeEpic: Epic<any> = action$ => action$.pipe(
  ofType(constants.TOGGLE_HOME),
  tap((action: any) => ClientManager.toggleHome()),
  ignoreElements(),
);

export default combineEpics(
  openDappEpic,
  addAppItemEpic,
  toggleHomeEpic,
);