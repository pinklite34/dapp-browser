import * as path from 'path';
import { BrowserWindow } from 'electron';

import { RendererConf, globalUUIDList } from '../../helpers/constants/globalVariables';
import { dappsTempPath, DAPPS_DOWNLOAD_PATH } from '../../helpers/constants/appPaths';
import { functionPromiseTimeout, mkdirp, readDir, readFile, checkExists } from '../../helpers/utils';
import { DappFrame } from '../../helpers/systemComponents/DappFrame';
import PermissionManager from '../../helpers/systemComponents/PermissionManager';
import StoreManager from '../../helpers/systemComponents/StoreManager';
import IpfsStorage from '../IpfsStorage/component';
import { component as FileManager } from '../FileManager';

import * as actions from './actions';
import * as constants from './constants';
import { AppItem, ReadyDapp, DappDownloadEntity } from './models';
import { createDappView, validateDappManifest, validateDapps } from './utils';
import { component as Dapp } from '../Dapp';
import ClientManager from '../../helpers/systemComponents/ClientManager';
import * as clientActions from '../../helpers/actions/client';
import * as ClientAppTrayActions from 'ClientApp/redux/actions/tray';

let installedDapps: AppItem[] = [];

class AppsProvider {
  static requestAllDappsList(): DappDownloadEntity[] {
    return [{
      hash: 'QmeN8trCSyJ3ndhY21NzmKoAtXLRxKBKBBW2eGJnLVPMqj',
      appName: 'BlockExplorer',
      preview: '',
      categories: [],
    }];
  }
}

export default class AppsManager {
  id: number;
  icon: string;
  permissions: any[];
  static readyDapps: ReadyDapp[] = [];

  static getAppItem(appName: string) {
    const targetDapp = AppsManager.installedDapps.find((item: AppItem) => item.appName === appName);
    const randomKey = Math.floor(Math.random() * 1000);

    return Object.assign({}, targetDapp, {
      id: randomKey,
      statusIcon: ['running'], // @todo add icon resolve
    });
  }

  static get installedDapps(): AppItem[] {
    return installedDapps;
  }

  static setInstalledDapps(dappsList: AppItem[]): void {
    installedDapps = dappsList;
  }

  static addInstalledDapp(dapp: AppItem): void {
    const foundDapp = installedDapps.find((item) => item.appName === dapp.appName);

    if (!foundDapp) {
      installedDapps.push(dapp);
    }
  }

  static setAbsoluteDappPaths(item: AppItem, folder: string = ''): AppItem {
    const icon = path.join(folder, item.icon).replace(/\\/g, '/');
    const preview = path.join(folder, item.preview).replace(/\\/g, '/');
    const main = path.join(folder, item.main).replace(/\\/g, '/');

    return { ...item, icon, preview, main };
  }

  static async getAllDapps(): Promise<DappDownloadEntity[]> {
    const allDappsList = AppsProvider.requestAllDappsList();
    await AppsManager.parseDapps();

    return allDappsList.map((dapp) => ({
      ...dapp,
      installed: !!AppsManager.getInstalledDappItem(dapp.appName),
    }));
  }

  // Get dapp item by name case insensitive
  static getInstalledDappItem(dappName: string = ''): AppItem {
    return AppsManager.installedDapps.find(dappObj => dappObj.appName && dappObj.appName.toLowerCase() === dappName.toLowerCase());
  }

  static async installDapp(dappName: string, hash: string): Promise<void> {
    const dapp = AppsManager.getInstalledDappItem(dappName);

    if (dapp) {
      return;
    }
    const downloadedDappPath = await AppsManager.downloadDapp(hash);
    const dappManifest = await AppsManager.getDappManifest(downloadedDappPath);
    if (!dappManifest) {
      throw Error('Dapp is invalid');
    }
    AppsManager.addInstalledDapp(dappManifest);
  }

  static async downloadDapp(hash: string): Promise<string> {
    const dappFolder = await functionPromiseTimeout(() => IpfsStorage.downloadFolder(hash), 30000);
    await FileManager.saveFolder(dappsTempPath, dappFolder);
    return path.join(dappsTempPath, hash);
  }

  static async parseDapps(): Promise<AppItem[]> {
    // For development use DAPPS_DOWNLOAD_PATH instead dappsTempPath
    const dappTempPathAvailable = await checkExists(dappsTempPath);

    if (dappTempPathAvailable) {
      const dappsFolders: string[] = await readDir(dappsTempPath);

      const promises = dappsFolders.map(folder => AppsManager.getDappManifest(folder)); // @todo rewrite with async lib
      const dapps = await Promise.all(promises);

      const validDapps = validateDapps(dapps);
      AppsManager.setInstalledDapps(validDapps);
      return validDapps;
    }

    await mkdirp(dappsTempPath);

    return [];
  }

  static async getDappManifest(folder: string = ''): Promise<AppItem> {
    const fileContent = await readFile(path.join(folder, 'manifest.json'));
    const manifest = AppsManager.setAbsoluteDappPaths(JSON.parse(fileContent), folder);

    await validateDappManifest(manifest);
    return manifest;
  }

  static getDappRenderer(dappName: string = ''): RendererConf {
    return globalUUIDList.find(item => item.name === dappName && item.status === 'dapp');
  }

  static correctDappViewBounds(clientWindow: BrowserWindow): void {
    const state = StoreManager.store.getState();
    const view = clientWindow.getBrowserView();
    const windowBounds = clientWindow.getBounds();
    if (view) {
      const dappFrame: Electron.Rectangle = new DappFrame(state.client, windowBounds);
      view.setBounds(dappFrame);
    }
  }

  // Find ready dapp name without case sensitive
  static isDappReady(dappName: string = ''): ReadyDapp {
    return AppsManager.readyDapps.find((dapp: ReadyDapp) => dapp.name.toLowerCase() === dappName.toLowerCase());
  }

  static addReadyDapp(sourceUUID: string, name: string): void {
    AppsManager.readyDapps.push({ name, uuid: sourceUUID });
  }

  static async createDapp(targetDappName: string, clientWindow: BrowserWindow): Promise<void> {
    const dapp = AppsManager.getInstalledDappItem(targetDappName);
    const dappRenderer = await createDappView(globalUUIDList, dapp);
    const dappView = dappRenderer && dappRenderer.dappView || null;
    const isDappReady = AppsManager.isDappReady(targetDappName);
    const dappReadyPromise = !isDappReady ? StoreManager.onAction(constants.DAPP_CONTENT_LOADED, action => action.meta.sourceUUID === dappRenderer.id) : true;

    const activeDapp = Dapp.getActiveDapp();
    if (activeDapp) {
      activeDapp.resetDappFocus();
    }

    clientWindow.setBrowserView(dappView);

    AppsManager.correctDappViewBounds(clientWindow);

    // Waiting for loading DOM of dapp
    await dappReadyPromise;
    const createdDapp = new Dapp(dappRenderer);
    createdDapp.setDappFocus();
  }

  static toggleHome(): void {
    const activeDapp = Dapp.getActiveDapp();
    if (activeDapp) {
      activeDapp.resetDappFocus();
    }
    ClientManager.clientWindow.setBrowserView(null);
  }

  static async openDapp(dappName: string): Promise<void> {
    if (!dappName) {
      throw new Error('AppsManager.openDapp method cancelled with error: dappName is undefined');
    }
    const clientWindow = ClientManager.clientWindow;
    await ClientManager.isClientWindowLoaded;

    const dapp = AppsManager.getInstalledDappItem(dappName);

    if (dapp) {
      await PermissionManager.checkDappPermissions(dappName, dapp.permissions, clientWindow);
      await AppsManager.createDapp(dappName, clientWindow);
    }

    StoreManager.store.dispatch(clientActions.addAppItem(AppsManager.getAppItem(dappName)));
    StoreManager.store.dispatch(ClientAppTrayActions.switchDapp(dappName));

  }
}
