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
import { UserService } from 'services';
import update from 'immutability-helper';
import { Observable } from 'rxjs';
const initialState = {
  ...errorPendingInitialState,
  isLoggedIn: false
};

const loginUserReducer = (state, { payload, fromAction }) => {
  window.sessionStorage.setItem('loggedIn', true)

  return update(state, {
    isLoggedIn: { $set: true },
    errors: {$set: []}
  })
}

const logoutReducer = (state) => {
  window.sessionStorage.setItem('loggedIn', false);
  window.location.reload()
  return update(state, {
    isLoggedIn: { $set: false }
  })
}

const handleError = fromAction => error =>
  Observable.of(redux.actions.registerError(fromAction.type, { error, fromAction }));

export const epics = createEpicScenario({
  userLogin: {
    type: 'USER_LOGIN',
    epic: fromAction => UserService.loginUser(fromAction)
      .map(toActionCreator(redux.actions.login, fromAction))
      .catch(handleError(fromAction))
  },
  logout: {
    type: 'LOGOUT',
    epic: () => UserService.logout()
      .map(toActionCreator(redux.actions.logout))
  }
})

export const redux = createReducerScenario({
  login: { type: 'LOGIN_USER', reducer: loginUserReducer },
  logout: { type: 'LOGOUT', reducer: logoutReducer },
  registerError: { type: 'AUTH_REDUCER_ERROR', reducer: errorReducer },
});

export const reducer = { authorize: redux.getReducer(initialState) };

export const getAuthReducer = state => state.authorize;
export const getRegistrationStatus = state => getAuthReducer(state).isRegistered;
export const getLoggedInStatus = state => getAuthReducer(state).isLoggedIn;
export const getLoginError = state => getError(getAuthReducer(state), epics.actionTypes.userLogin)
