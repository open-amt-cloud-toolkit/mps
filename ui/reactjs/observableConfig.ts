/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/
import { from } from 'rxjs'
import { setObservableConfig } from 'recompose';

setObservableConfig({
  fromESObservable: from
});
