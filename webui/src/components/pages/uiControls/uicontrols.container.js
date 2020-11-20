/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { UiControl } from './uicontrols';

export const UiControlsContainer = withTranslation()(connect(null, null)(UiControl))