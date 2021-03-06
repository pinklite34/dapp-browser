import * as constants from 'MainApp/modules/FileManager/constants';
import * as actions from 'MainApp/modules/FileManager/actions';
import StoreSubscriber from '../../classes/internal/StoreSubscriber';

class FileManager extends StoreSubscriber {
  async openFile(): Promise<string> {
    const action = await this.actionPromise({
      onStart: actions.openDialog(),
      successType: constants.FILE_MANAGER_OPEN_DIALOG_SUCCESS,
      failureType: constants.FILE_MANAGER_OPEN_DIALOG_FAILURE,
    });

    return action.payload.entry;
  }
}

export default new FileManager();

