/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { Grid, Cell } from '../grid'
import { Panel } from '../panel';

export const TwoPanel = ({ first, second }) => (
    <div>
        <Panel>
        <Grid>
            <Cell className="col-4">
                {first}
            </Cell>
            <Cell className="col-4">
                {second}
            </Cell>
        </Grid>
        </Panel>

    </div>
)