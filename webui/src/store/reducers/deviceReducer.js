/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import {
  createReducerScenario,
  createEpicScenario,
  toActionCreator,
  getError,
  errorReducer,
  errorPendingInitialState
} from 'store/utilities';

import update from 'immutability-helper';
import { DevicesService, PowerActionsService } from 'services';
import { Observable } from 'rxjs'
import { getActionById } from 'utilities';

const initialState = {
  ...errorPendingInitialState,
  devices: [],
  powerActionStatus: [],
  isDisaplayMesage: false
}

const deviceReducer = (state, { payload }) => {
  let connectedDevices = 0;
  let disconnectedDevices = 0;
  payload.forEach(device => {
    if (device.conn === 1) {
      connectedDevices++
    } else {
      disconnectedDevices++
    }
  })
  return update(state, {
    devices: { $set: payload },
    connected: { $set: connectedDevices },
    disconnected: { $set: disconnectedDevices },
    errors: { $set: [] }
  })
}

const powerActionReducer = (state, { payload, fromAction }) => {
  let actionStatus = {
    guid: fromAction.payload.guid,
    id: fromAction.payload.guid,
    title: payload.Body.ReturnValueStr,
    description: payload.Body.ReturnValueStr === "SUCCESS" ? `${fromAction.payload.guid} - ${getActionById(fromAction.payload.action)} Success` : `${fromAction.payload.guid} - ${getActionById(fromAction.payload.action)} Failed`,
    backgroundColor: payload.Body.ReturnValueStr === "SUCCESS" ? '#5cb85c' : '#f0ad4e',
    icon: payload.Body.ReturnValueStr === "SUCCESS" ? "check-circle" : "exclamation-circle"
  }
  return update(state, {
    powerActionStatus: {
      $set: [actionStatus]
    },
    isDisaplayMesage: { $set: true }
  })
}

const updateDisplayMessage = (state) => {
  return update(state, {
    isDisaplayMesage: { $set: false }
  })
}

const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

const handlePowerActionsError = fromAction => error =>
  Observable.of(redux.actions.powerActionError(fromAction.type, { error, fromAction }))

const updatePowerActionsErrorReducer = (state, { payload, error }) => {
  const errorDesc = (error.ajaxError.response && error.ajaxError.response.errorDescription.split(":")[1]) || Math.random()
  const description = (error.ajaxError.response && error.ajaxError.response.error) || 'Power Action Failed'
  let actionStatus = {
    guid: errorDesc,
    id: errorDesc,
    title: "ERROR",
    description: description,
    backgroundColor: '#d9534f',
    icon: "times-circle"
  }
  return update(state, {
    powerActionStatus: {
      $set: [actionStatus]
    }
  })
}

const updateSelectedDevices = (state, { payload }) => {
  return update(state, {
    selectedDevices: { $set: payload }
  })
}

const clearToastMessagesReducer = (state, { payload }) =>{
  return update(state, {
    powerActionStatus: {
      $set: []
    }
  })
}

export const epics = createEpicScenario({
  fetchDevices: {
    type: 'FETCH_DEVICES',
    epic: fromAction => DevicesService.fetchDevices()
      .map(toActionCreator(redux.actions.devices, fromAction))
      .catch(handleError(fromAction))
  },
  sendPowerAction: {
    type: 'POWER_ACTION',
    epic: fromAction => PowerActionsService.sendPowerAction(fromAction)
      .map(toActionCreator(redux.actions.powerAction, fromAction))
      .catch(handlePowerActionsError(fromAction))
  }
})

export const redux = createReducerScenario({
  devices: { type: 'FETCH_DEVICES', reducer: deviceReducer },
  powerAction: { type: 'POWER_ACTION', reducer: powerActionReducer },
  registerError: { type: 'DEVICE_REDUCER_ERROR', reducer: errorReducer },
  updateSelectedDevices: { type: 'DEVICES_UPDATE_SELECTED_DEVICES', reducer: updateSelectedDevices },
  setDisplayMessage: { type: 'DISPLAY_MESSAGE', reducer: updateDisplayMessage },
  powerActionError: { type: "UPDATE_POWER_ACTIONS_ERROR", reducer: updatePowerActionsErrorReducer },
  clearToastMessages: { type: "CLEAR_TOAST_MESSAGES", reducer: clearToastMessagesReducer }
});

export const reducer = { devices: redux.getReducer(initialState) };

export const getDevicesReducer = state => state.devices;
export const getDevices = state => getDevicesReducer(state).devices;
export const getConnectedDevicesCount = state => getDevicesReducer(state).connected;
export const getDisconnectedDevicesCount = state => getDevicesReducer(state).disconnected;
export const getDevicesError = state => getError(getDevicesReducer(state), epics.actionTypes.fetchDevices);
export const getSelectedDevices = state => getDevicesReducer(state).selectedDevices;
export const getPowerActionStatus = state => getDevicesReducer(state).powerActionStatus;
export const getDisaplayMesage = state => getDevicesReducer(state).isDisaplayMesage;
