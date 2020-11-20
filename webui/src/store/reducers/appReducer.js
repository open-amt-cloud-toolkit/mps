// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import 'rxjs';
import { Observable } from 'rxjs';
import { AuthService } from 'services';
import update from 'immutability-helper';
import {
  createAction,
  createReducerScenario,
  createEpicScenario,
  errorPendingInitialState,
  pendingReducer,
  errorReducer,
  setPending,
  toActionCreator,
  getPending,
  getError
} from 'store/utilities';
import { svgs } from 'utilities';
import Config from 'app.config'

// ========================= Epics - START
const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

export const epics = createEpicScenario({
  /** Initializes the redux state */
  initializeApp: {
    type: 'APP_INITIALIZE',
    epic: () => [
      epics.actions.fetchUser()
    ]
  },

  /** Get the user */
  fetchUser: {
    type: 'APP_USER_FETCH',
    epic: (fromAction, store) =>
      AuthService.getCurrentUser()
        .map(toActionCreator(redux.actions.updateUser, fromAction))
        .catch(handleError(fromAction))
  },

  /** Listen to route events and emit a route change event when the url changes */
  detectRouteChange: {
    type: 'APP_ROUTE_EVENT',
    rawEpic: (action$, store, actionType) =>
      action$
        .ofType(actionType)
        .map(({ payload }) => payload) // payload === pathname
        .distinctUntilChanged()
        .map(createAction('EPIC_APP_ROUTE_CHANGE'))
  },

});
// ========================= Epics - END


// ========================= Reducers - START
const initialState = {
  ...errorPendingInitialState,
  theme: 'dark',
  version: undefined,
  logo: svgs.contoso,
  name: 'companyName',
  isDefaultLogo: true,
  userPermissions: new Set(),
  isRps: '' || window.sessionStorage.getItem('isRps'),
  rpsEnabled: Config.rpsEnabled
};

const updateUserReducer = (state, { payload, fromAction }) => {
  return update(state, {
    userPermissions: { $set: new Set(payload.permissions) },
    ...setPending(fromAction.type, false)
  });
};


const updateThemeReducer = (state, { payload }) => update(state,
  { theme: { $set: payload } }
);

const logoReducer = (state, { payload, fromAction }) => update(state, {
  logo: { $set: payload.logo ? payload.logo : svgs.contoso },
  name: { $set: payload.name ? payload.name : 'companyName' },
  isDefaultLogo: { $set: payload.logo ? false : true },
  ...setPending(fromAction.type, false)
});

const setRpsStateReducer = (state, {payload}) => {
  window.sessionStorage.setItem('isRps', payload);
  return update( state, {
  isRps: { $set: payload}
})}


/* Action types that cause a pending flag */
const fetchableTypes = [
  epics.actionTypes.fetchDeviceGroupFilters,
  epics.actionTypes.updateLogo,
  epics.actionTypes.fetchLogo
];

export const redux = createReducerScenario({
  updateUser: { type: 'APP_USER_UPDATE', reducer: updateUserReducer },
  changeTheme: { type: 'APP_CHANGE_THEME', reducer: updateThemeReducer },
  registerError: { type: 'APP_REDUCER_ERROR', reducer: errorReducer },
  isFetching: { multiType: fetchableTypes, reducer: pendingReducer },
  updateLogo: { type: 'APP_UPDATE_LOGO', reducer: logoReducer },
  updateRpsStatus: { type: 'UPDATE_RPS_STATUS', reducer: setRpsStateReducer }
});

export const reducer = { app: redux.getReducer(initialState) };
// ========================= Reducers - END

// ========================= Selectors - START
export const getAppReducer = state => state.app;
export const getTheme = state => getAppReducer(state).theme;
export const getLogo = state => getAppReducer(state).logo;
export const getName = state => getAppReducer(state).name;
export const isDefaultLogo = state => getAppReducer(state).isDefaultLogo;
export const setLogoError = state =>
  getError(getAppReducer(state), epics.actionTypes.updateLogo);
export const setLogoPendingStatus = state =>
  getPending(getAppReducer(state), epics.actionTypes.updateLogo);
export const getLogoError = state =>
  getError(getAppReducer(state), epics.actionTypes.fetchLogo);
export const getLogoPendingStatus = state =>
  getPending(getAppReducer(state), epics.actionTypes.fetchLogo);
export const getUserPermissions = state => getAppReducer(state).userPermissions;
export const getRpsStatus = state =>  getAppReducer(state).isRps;
export const getRpsEnabledStatus = state => getAppReducer(state).rpsEnabled;
// ========================= Selectors - END
