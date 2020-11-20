// Copyright (c) Microsoft. All rights reserved.
/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { combineReducers } from 'redux'

// Reducers
import { reducer as appReducer } from './reducers/appReducer'
import {reducer as authReducer} from './reducers/authReducer'
import {reducer as deviceReducer } from './reducers/deviceReducer'

const rootReducer = combineReducers({
  ...appReducer,
  ...authReducer,
   ...deviceReducer
})

export default rootReducer
