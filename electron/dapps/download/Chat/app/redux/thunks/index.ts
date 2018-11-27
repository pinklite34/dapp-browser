import { formValueSelector } from 'redux-form';

import * as constants from '../constants';
import { Message, RoomComponent, RoomComponentStore } from '../../services/RoomComponentService';
import * as actions from '../actions';
import { IState } from '../reducers';
import * as selectors from '../selectors';
import * as events from '../events';

export const onSubmitMainFormThunk = (roomId: string) => async (dispatch: any) => {
  dispatch(selectRoom(roomId));

  actions.navigateToChat();

};

export const addRoomThunk = (roomName: string) => async (dispatch: any, getState: any) => {
  if (RoomComponentStore.getRoomByName(roomName)) {
    throw new Error('Room already exist');
  }

  const room = await RoomComponent.create(roomName);
  room.on('message', (message: Message) => {
    const state: IState = getState();

    if (state.rooms.selectedRoom !== room.id) {
      const roomUnreadMessagesCounter = selectors.getRoomUnreadMessagesCounter(room.id)(state) + 1;
      dispatch(setRoomUnreadMessages(room.id, roomUnreadMessagesCounter));
    }

    dispatch(actions.addRoomMessage(room.id, message));
  });
  RoomComponentStore.addRoom(room);

  dispatch(actions.addRoom(room.id, roomName));
  dispatch(selectRoom(room.id));
};

export const roomRemoveThunk = (roomId: string) => (dispatch: any, getState: any) => {
  const state: IState = getState();
  const selectedRoom = state.rooms.selectedRoom;
  const room = RoomComponentStore.getRoomById(roomId);

  if (!room) {
    throw new Error('Room does not exist');
  }

  if (selectedRoom === roomId) {
    dispatch(actions.deselectRoom());
  }
  dispatch(actions.removeRoom(roomId));
  dispatch(actions.removeRoomMessages(roomId));

  room.leave();
  RoomComponentStore.removeRoom(roomId);
  dispatch(updateFilterRoomListThunk());
};

export const updateFilterRoomListThunk = () => (dispatch: any, getState: any) => {
  const state = getState();

  const filterRoomsFormSelector = formValueSelector(constants.FORM_CHAT_ROOMS_SEARCH);

  const searchString: string = filterRoomsFormSelector(state, constants.FIELD_FORM_CHAT_ROOMS_SEARCH_STRING);
  dispatch(filterRoomListThunk(searchString));
};

export const filterRoomListThunk = (searchString: string) => (dispatch: any, getState: any) => {
  if (!searchString) {
    dispatch(actions.resetFilterRoomList());
  } else {
    const state: IState = getState();
    const filteredRoomList = state.rooms.roomList.filter((room) => room.roomName.includes(searchString));
    dispatch(actions.setFilteredRoomList(filteredRoomList));
  }
};

export const removeSelectedRoomThunk = () => (dispatch: any, getState: any) => {
  const state: IState = getState();

  if (state.rooms.selectedRoom) {
    dispatch(roomRemoveThunk(state.rooms.selectedRoom));
  }
};

export const selectRoom = (roomId: string) => (dispatch: any) => {
  dispatch(actions.selectRoom(roomId));
  dispatch(setRoomUnreadMessages(roomId, 0));
}

export const setRoomUnreadMessages = (roomId: string, counter: number) => (dispatch: any, getState: any) => {
  dispatch(actions.setRoomUnreadMessages(roomId, counter));

  const state: IState = getState();
  const unreadRoomsCounter = selectors.getAllRoomsUnreadMessagesCounter(state);
  events.setTrayCounter(unreadRoomsCounter);
}