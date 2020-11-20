/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Profiles } from './profiles'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

export const ProfilesContainer = withTranslation()(connect(null, null)(Profiles));