import { store, sendDataChannel1, sendDataChannel2, receiveDataChannel } from './array';
import * as actions from './redux/actions/channel'

const renderState = () => {
  //next todo library object dapp will emit events on store pub-sub actions in: `dapp.emit('event-name', ...)`
 
}

const initUi = () => {
  renderState();
  store.subscribe(renderState);

  receiveDataChannel('testChannel2', (channelData: any) => {
    document.getElementById('area').innerHTML = channelData;
  })

  receiveDataChannel('testChannel1', (channelData: any) => {
    document.getElementById('messageId').innerHTML = channelData;
  })

  if( document.getElementById('communicate') ) {
    document.getElementById('communicate').addEventListener('click', () => {
      store.dispatch({
        type: 'INTENT_OPEN_CHANNELS',
        payload: {
          targetDapp: 'Game'
        }
      });
    });
  }

  if( document.getElementById('networkGetBlockButton') ) {
    document.getElementById('networkGetBlockButton').addEventListener('click', () => {
      store.dispatch(actions.networkGetBlock());
    });
  }

  //Open files (File Manager)
  if( document.getElementById('openDialogButton') ) {
    document.getElementById('openDialogButton').addEventListener('click', () => {
      store.dispatch(actions.openFileManagerDialog());
    });
  }

  // Download
  if( document.getElementById('downloadButton') ) {
    document.getElementById('downloadButton').addEventListener('click', () => {
      const ipfsHashElement = <HTMLInputElement> document.getElementById('ipfsHash')
      if (ipfsHashElement.value) {
        store.dispatch(actions.downloadIpfsFile(ipfsHashElement.value));
      }
    });
  }

  if( document.getElementById('sendchannel1') ) {
    document.getElementById('sendchannel1').addEventListener('click', () => {
      sendDataChannel1('testdata 1');
    });
  }
  
  if( document.getElementById('sendchannel2') ) {
    document.getElementById('sendchannel2').addEventListener('click', () => {
      sendDataChannel2('testdata 2');
    });
  }

  if( document.getElementById('send_channel') ) {
    document.getElementById('send_channel').addEventListener('click', () => {
      //sendDataChannelId('channelId', action);
    });
  }

  if( document.getElementById('ipfsRoomSubscribe') ) {
    document.getElementById('ipfsRoomSubscribe').addEventListener('submit', (e) => {
      e.preventDefault()
      const formElements = e.target.elements
      const roomName = formElements.ipfsRoomName && formElements.ipfsRoomName.value
      store.dispatch(actions.ipfsRoomSubscribe(roomName))
    });
  }

  if( document.getElementById('ipfsRoomTextForm') ) {
    document.getElementById('ipfsRoomTextForm').addEventListener('submit', (e) => {
      e.preventDefault()
      const formElements = e.target.elements
      const message = formElements.ipfsRoomText && formElements.ipfsRoomText.value || ''

      const roomNameElement = <HTMLInputElement> document.getElementById('ipfsRoomName')
      const roomName = roomNameElement && roomNameElement.value || ''
      console.log('topic', roomName, message)
      store.dispatch(actions.ipfsRoomSendMessage(message, roomName))
    });
  }


  //@todo add 
  // INTENT_CHANNEL_DATA_PASS(FM)
  // ACCEPT_CHANNEL_DATA_PASS(ChannelId)
  // through new channelId
  // FM_OPEN_FILE
  // FM_OPEN_FILE_SUCCESS
};

initUi();
