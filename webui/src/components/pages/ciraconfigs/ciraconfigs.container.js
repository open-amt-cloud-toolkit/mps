/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import {CiraConfigs } from './ciraconfigs'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

export const CiraConfigsContainer = withTranslation()(connect(null, null)(CiraConfigs));