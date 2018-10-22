import { action } from 'typesafe-actions'
import * as constants from '../constants'

export const openChannelIntent = () => action(constants.INTENT_OPEN_CHANNELS)

export const openFileManagerDialog = () => action(constants.FILE_MANAGER_OPEN_DIALOG)

export const uploadIpfsFile = (entry: string) => action(constants.IPFS_STORAGE_UPLOAD_FILE, {entry})

export const showFileEntries = () => action(constants.SHOW_FILE_ENTRIES)

export const networkGetBlock = () => action(constants.NETWORK_GET_BLOCK)

export const showBlock = () => action(constants.SHOW_BLOCK)

export const downloadIpfsFile = (hash: string) =>
  action(constants.IPFS_STORAGE_DOWNLOAD_FILE, { hash })

export const ipfsRoomSubscribe = (topic: string) =>
  action(constants.IPFS_ROOM_SUBSCRIBE, { topic })

export const ipfsRoomSendMessage = (message: string, roomName: string) =>
  action(constants.IPFS_ROOM_SEND_MESSAGE_TO_ROOM, { message, roomName })
