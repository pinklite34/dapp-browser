import * as uuidv4 from 'uuid/v4';
import * as actions from '../redux/actions/channel';
import * as constants from '../redux/constants';

import StoreUIDSubscriber from './StoreUIDSubscriber';

interface SubscribeOptions {
  onMessage: (message: any) => void;
  onJoined?: (peer: string) => void;
  onLeft?: (peer: string) => void;
  onSubscribe?: (peer: string) => void;
}

export default class IpfsRoom extends StoreUIDSubscriber {
  topic: string;
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

    this.subscribePromise = this.actionPromise(uid, {
      onStart: actions.ipfsRoomSubscribe(topic),
      successType: constants.IPFS_ROOM_SUBSCRIBE_SUCCESS,
      failureType: constants.IPFS_ROOM_SUBSCRIBE_FAILURE,
    });

    const action: any = await this.subscribePromise;

    this.unsubscribeOnMessage = this.subscribeActions(constants.IPFS_ROOM_SEND_MESSAGE_TO_DAPP, uid, (action) => options.onMessage(action.payload.message));
    this.unsubscribeOnJoined = this.subscribeActions(constants.IPFS_ROOM_PEER_JOINED, uid, (action) => options.onJoined(action.payload.peer));
    this.unsubscribeOnLeft = this.subscribeActions(constants.IPFS_ROOM_PEER_LEFT, uid, (action) => options.onLeft(action.payload.peer));

    options.onSubscribe && options.onSubscribe(action.payload.peerId);
  }

  async sendMessageBroadcast(message: string) {
    const messageId = uuidv4();
    return this.actionPromise(messageId, {
      onStart: actions.ipfsRoomSendMessageBroadcast(message, this.topic, messageId),
      successType: constants.IPFS_ROOM_SEND_MESSAGE_BROADCAST_SUCCESS,
      failureType: constants.IPFS_ROOM_SEND_MESSAGE_BROADCAST_FAILURE,
    });

  }

  async sendMessageTo(message: string, peer: string) {
    const messageId = uuidv4();
    return this.actionPromise(messageId, {
      onStart: actions.ipfsRoomSendMessageToPeer(message, this.topic, peer, messageId),
      successType: constants.IPFS_ROOM_SEND_MESSAGE_TO_PEER_SUCCESS,
      failureType: constants.IPFS_ROOM_SEND_MESSAGE_TO_PEER_FAILURE,
    });
  }

  async leave() {
    await this.subscribePromise;
    this.store.dispatch(actions.ipfsRoomLeave(this.topic));
    this.unsubscribeOnMessage && this.unsubscribeOnMessage();
    this.unsubscribeOnJoined && this.unsubscribeOnJoined();
    this.unsubscribeOnLeft && this.unsubscribeOnLeft();
  }
}