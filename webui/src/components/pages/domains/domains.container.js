/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Domains } from './domains'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

export const DomainsContainer = withTranslation()(connect(null, null)(Domains));