/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import {NetworkConfigs } from './networkconfigs'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

export const NetworkConfigsContainer = withTranslation()(connect(null, null)(NetworkConfigs));