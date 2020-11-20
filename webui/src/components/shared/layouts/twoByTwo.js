/*********************************************************************
* Copyright (c) Intel Corporation 2020
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/
import React from 'react';
import { Grid, Cell } from '../grid'
import { Panel } from '../panel'

export const FourPanel = ({ first, second, third, fourth }) => (
    <div>
        <Panel>
            <Grid>
                <Cell className="col-4">
                    {first}
                </Cell>
                <Cell className="col-4">
                    {second}
                </Cell>
                <Cell className="col-4">
                    {third}
                </Cell>
                <Cell className="col-4">
                    {fourth}
                </Cell>

            </Grid>
        </Panel>

    </div>
)