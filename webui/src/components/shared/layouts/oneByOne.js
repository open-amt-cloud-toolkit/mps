/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { joinClasses } from 'utilities'
import { Grid, Cell } from '../grid'
import { Panel } from '../panel';

export const SinglePanel = ({ className, children }) => (
    <div className={joinClasses('single-panel-container', className)}>
        <Panel>
            <Grid>
                <Cell className="col-6">
                    {children}
                </Cell>
            </Grid>
        </Panel>
    </div>
)