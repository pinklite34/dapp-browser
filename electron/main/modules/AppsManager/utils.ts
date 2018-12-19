import * as fs from 'fs';
import { BrowserView, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as uuidv4 from 'uuid/v4';
import * as Bluebird from 'bluebird';
import { all } from 'async';

import * as AppsManagerModels from './models';
import { RendererConf } from '../../helpers/constants/globalVariables';
import { checkExists, mkdirp, copyFile } from '../../helpers/utils';
import { appTempPath, dappsTempPath, dappLibTempBundlePath, DAPP_LIB_BUNDLE_PATH } from '../../helpers/constants/appPaths';

let dappView: Electron.BrowserView = null;

declare global {
  export interface Promise<T> extends Bluebird<T> {
  }

  interface PromiseConstructor {
    delay: typeof Bluebird.prototype.delay;
  }
}

declare const Promise: any;

export async function createDappView(globalUUIDList: RendererConf[], dapp: AppsManagerModels.AppItem): Promise<RendererConf> { // entryPath: string, appName: string
  const createdDapp = dapp && globalUUIDList.find(item => item.name === dapp.appName && item.status === 'dapp');

  if (createdDapp) { // Skip creating a new BrowserView for the same dapp
    return createdDapp;
  }
  const uuidDapp = uuidv4();
  const authorizedChannelsList = ['channelId1', 'channelId2']; // next todo get channels list from dapp manifest

  let webPrefObj = {
    nodeIntegration: false,
    preload: path.join(__dirname, '..', 'preload.js'),
    additionalArguments: [
      '--uuid-renderer='.concat(uuidDapp),
      '--channels='.concat(authorizedChannelsList.join(';')),
    ],
  };

  if (process.env.ELECTRON_ENV !== 'development') {
    webPrefObj = Object.assign(webPrefObj, { sandbox: true });
  }

  dappView = new BrowserView({
    webPreferences: webPrefObj,
  });

  try {
    const dappLibBundleExist = await checkExists(dappLibTempBundlePath);

    if (!dappLibBundleExist) {
      await mkdirp(path.dirname(dappLibTempBundlePath));
      await copyFile(DAPP_LIB_BUNDLE_PATH, dappLibTempBundlePath);
    }

  } catch (error) {
    console.log('copy dapp lib error', error);
  }

  // console.log('entry: ', path.join(DAPPS_DOWNLOAD_PATH, dapp.appName, dapp.main));
  const dappPathUrl = `file://${dapp.main}`;
  dappView.webContents.loadURL(dappPathUrl); // todo pass @param path to index.html

  if (process.env.ELECTRON_ENV === 'development') {
    const devtools = new BrowserWindow();
    dappView.webContents.setDevToolsWebContents(devtools.webContents);
    dappView.webContents.openDevTools({ mode: 'detach' });
  }

  const renderIdDapp = dappView.webContents.getProcessId();

  const rendererObj: RendererConf = {
    dappView,
    id: uuidDapp,
    status: 'dapp',
    winId: renderIdDapp,
    name: dapp.appName,
  };
  globalUUIDList.push(rendererObj);

  return rendererObj;
}
