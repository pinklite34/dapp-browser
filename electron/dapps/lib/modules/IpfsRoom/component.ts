import * as uuidv4 from 'uuid/v4';
import { AnyAction } from 'redux';

import * as actions from 'MainApp/modules/IpfsRoom/actions';
import * as constants from 'MainApp/modules/IpfsRoom/constants';
import StoreSubscriber from '../../classes/internal/StoreSubscriber';

interface SubscribeOptions {
  onMessage: (message: any) => void;
  onJoined?: (peer: string) => void;
  onLeft?: (peer: string) => void;
  onSubscribe?: (peer: string) => void;
}

export default class IpfsRoom extends StoreSubscriber {
  topic: string;
  id: string;
  // Callbacks for removing listeners
  subscribePromise: Promise<any>;
  unsubscribeOnMessage: () => void | null;
  unsubscribeOnLeft: () => void | null;
  unsubscribeOnJoined: () => void | null;

  async subscribe(topic: string, options: SubscribeOptions) {
    const uid = uuidv4();
    this.topic = topic;

    if (!options) {
      return;
    }

    this.unsubscribeOnMessage = options.onMessage && this.subscribeUIDActions(
      {
        uid,
        actionTypes: [constants.IPFS_ROOM_SEND_MESSAGE_TO_DAPP],
        callback: (action) => options.onMessage(action.payload.message)
      }
    );

    this.unsubscribeOnJoined = options.onJoined && this.subscribeUIDActions({
      uid,
      actionTypes: [constants.IPFS_ROOM_PEER_JOINED],
      callback: (action) => options.onJoined(action.payload.peer),
    });

    this.unsubscribeOnLeft = options.onLeft && this.subscribeUIDActions({
      uid,
      actionTypes: constants.IPFS_ROOM_PEER_LEFT,
      callback: (action) => options.onLeft(action.payload.peer),
    });

    this.subscribePromise = this.actionPromise({
      onStart: actions.ipfsRoomSubscribe(topic),
      successType: constants.IPFS_ROOM_SUBSCRIBE_SUCCESS,
      failureType: constants.IPFS_ROOM_SUBSCRIBE_FAILURE,
    }, uid);

    const action: any = await this.subscribePromise;
    this.id = action.payload.roomId;

    options.onSubscribe && options.onSubscribe(action.payload.peerId);
  }

  async sendMessageBroadcast(message: string) {
    this.store.dispatch(actions.ipfsRoomSendMessageBroadcast(message, this.id));
  }

  async sendMessageTo(message: string, peer: string) {
    this.store.dispatch(actions.ipfsRoomSendMessageToPeer(message, this.id, peer));
  }

  async getPeers() {
    const action: AnyAction = await this.actionPromise({
      onStart: actions.ipfsRoomGetPeers(this.id),
      successType: constants.IPFS_ROOM_GET_PEERS_SUCCESS,
      failureType: constants.IPFS_ROOM_GET_PEERS_FAILURE,
    });

    return action.payload.peerList;
  }

  async leave() {
    await this.subscribePromise;
    this.store.dispatch(actions.ipfsRoomLeave(this.id));
    this.unsubscribeOnMessage && this.unsubscribeOnMessage();
    this.unsubscribeOnJoined && this.unsubscribeOnJoined();
    this.unsubscribeOnLeft && this.unsubscribeOnLeft();
  }
}
