import * as path from 'path';
import * as os from 'os';

const isDev = process.env.ELECTRON_ENV === 'development';

export const appTempPath = path.join(os.tmpdir(), 'dapp-io-client-temp');

export const RENDERER_PATH: string =
  isDev ? path.join(__dirname, '..', '..', 'client') : path.join(__dirname, 'client');

export const PERMISSION_PATH: string =
  isDev ? path.join(__dirname, '..', '..', 'permissionManager') : path.join(__dirname, 'permissionManager');

export const DAPPS_DOWNLOAD_PATH: string =
  isDev ? path.join(__dirname, '..', '..', 'dapps', 'download') : path.join(__dirname, 'dapps', 'download');
// isDev ? path.join(__dirname, '..', '..', 'dapps', 'download') : path.join(appTempPath, 'dapps');

export const DAPP_LIB_BUNDLE_PATH: string =
  isDev ? path.join(__dirname, '..', '..', 'dapps', 'lib', 'build', 'app.bundle.js') : path.join(__dirname, 'dapps', 'lib', 'build', 'app.bundle.js');

export const dbTempPath = path.join(appTempPath, 'db');
// export const dappsTempPath = DAPPS_DOWNLOAD_PATH;
export const dappsTempPath = DAPPS_DOWNLOAD_PATH;
export const dappLibTempBundlePath = path.join(appTempPath, 'lib', 'build', 'app.bundle.js');
