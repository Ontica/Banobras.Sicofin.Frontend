/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { FlexLayoutModule, MediaMarshaller } from '@angular/flex-layout';


@NgModule({

  imports: [
    FlexLayoutModule
  ],

  exports: [
    FlexLayoutModule
  ],

})
export class AngularFlexLayoutModule {
  lastValue;

  public constructor( m: MediaMarshaller) {
    // @ts-ignore
    m.subject.subscribe((x) => {
      // @ts-ignore
      if (m.activatedBreakpoints.filter((b) => b.alias === 'print').length === 0) {
        // @ts-ignore
        this.lastValue = [...m.activatedBreakpoints];
      } else {
        // @ts-ignore
        m.activatedBreakpoints = [...this.lastValue];
        // @ts-ignore
        m.hook.collectActivations = () => {};
        // @ts-ignore
        m.hook.deactivations = [...this.lastValue];
      }
    });
  }
}
