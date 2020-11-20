// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
  getVersion,
  isDefaultLogo,
  getName,
  getReleaseNotes,
  setLogoError,
  setLogoPendingStatus
} from 'store/reducers/appReducer';
import { Settings } from './settings';

const mapStateToProps = state => ({
  version: getVersion(state),
  name: getName(state),
  isDefaultLogo: isDefaultLogo(state),
  releaseNotesUrl: getReleaseNotes(state),
  setLogoPending: setLogoPendingStatus(state),
  setLogoError: setLogoError(state)
});


export const SettingsContainer = translate()(connect(mapStateToProps, null)(Settings));
