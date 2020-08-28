// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { combineEpics } from 'redux-observable';

// Epics
import { epics as appEpics } from './reducers/appReducer';
import {epics as authEpics } from './reducers/authReducer';
import {epics as deviceEpics } from './reducers/deviceReducer'

// Extract the epic function from each property object
const epics = [
  ...appEpics.getEpics(),
  ...authEpics.getEpics(),
   ...deviceEpics.getEpics()
];

const rootEpic = combineEpics(...epics);

export default rootEpic;
