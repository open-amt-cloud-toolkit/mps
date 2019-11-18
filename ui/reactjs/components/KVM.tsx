/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 * Author : Ramu Bachala
 **********************************************************************/

import * as React from 'react'
import { PureCanvas } from './purecanvas';
import { componentFromStream, createEventHandler } from 'recompose';
import { tap, map, debounceTime, catchError, merge, startWith, throttleTime } from 'rxjs/operators'
import { combineLatest } from 'rxjs'

const KVM = componentFromStream((prop$) => {
  const { handler: mouseDown, stream: mouseDown$ } = createEventHandler();
  const { handler: mouseUp, stream: mouseUp$ } = createEventHandler();
  const { handler: mouseMove, stream: mouseMove$ } = createEventHandler();
  const { handler: mouseWheel, stream: mouseWheel$ } = createEventHandler();

  const events1$ = mouseMove$.pipe(startWith(new MouseEvent('mousemove')), throttleTime(200)) // dont send mousemove more than once in 200 ms
  const events2$ = mouseUp$.pipe(startWith(new MouseEvent('mouseup')))
  const events3$ = mouseDown$.pipe(startWith(new MouseEvent('mousedown')))

  var getCanvas$ = combineLatest(prop$, events1$, events2$, events3$).pipe(
    map(
      ([{ saveContext,canvasHeight,canvasWidth,mousemove, mousedown, mouseup }, event]: any) => { // what you get is a 2 element array with this.props and mouse event
        switch (event.type) {
          case 'mousemove':
            mousemove(event)
            break;
          case 'mousedown':
            mousedown(event)
            break;
          case 'mouseup':
            mouseup(event)
            break;
          default:
            break;
        }
        return <PureCanvas contextRef={saveContext} canvasHeight={canvasHeight} canvasWidth={canvasWidth}
          mouseDown={mouseDown}
          mouseUp={mouseUp}
          mouseMove={mouseMove}
          mouseWheel={mouseWheel} />
      }
    ),
    catchError((e) => { console.log(e); return null; })
  )

  return getCanvas$
});

export { KVM }