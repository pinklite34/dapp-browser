import * as IPFS from 'ipfs';
import * as fs from 'fs';
import * as path from 'path';

import { remoteConfig } from '../config/ipfs';
import { appTempPath } from '../constants/appPaths';

let ipfsInstance: IPFS;

const cleanRepo = async (repoPath: string) => {
  // This fixes a bug on Windows, where the daemon seems
  // not to be exiting correctly, hence the file is not
  // removed.
  logger.log('Cleaning repo.lock file');
  const lockPath = path.join(repoPath, 'repo.lock');

  fs.access(lockPath, fs.constants.F_OK, (err) => {
    if (err) {
      logger.warn(`unable to access file here: ${lockPath}`);
    } // throw err;
    fs.unlink(lockPath, (err) => {
      if (err) {
        logger.warn(`unable to delete file here: ${lockPath}`);
      } // throw err;
    });
  });
};

export const getReadyIpfsInstance = async (options: IPFS.Options = { repo: path.join(appTempPath, 'ipfs', 'repo') }): Promise<any> => {
  if (!ipfsInstance) {
    ipfsInstance = new IPFS({
      ...remoteConfig,
      repo: path.join(options.repo),
    });

    await cleanRepo(options.repo);
    return new Promise((resolve, reject) => {
      ipfsInstance.on('start', () => {
        resolve(ipfsInstance);
      });

      ipfsInstance.on('ready', () => {
        if (ipfsInstance.isOnline()) {
          logger.log('online');
        } else {
          logger.log('offline, try to start');
          ipfsInstance.start();
        }
      });

      ipfsInstance.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  return ipfsInstance;

};
