// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './rootEpic';
import rootReducer from './rootReducer';


export default function configureStore() {
  // Initialize the redux-observable epics
  const epicMiddleware = createEpicMiddleware(rootEpic);
  // Initialize the redux store with middleware
  return createStore(
    rootReducer,applyMiddleware(epicMiddleware)

  );
}
