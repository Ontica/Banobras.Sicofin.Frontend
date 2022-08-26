/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { BREAKPOINT } from '@angular/flex-layout';

const NOTEBOOK_BREAKPOINT = [{
  alias: 'notebook',
  suffix: 'notebook',
  mediaQuery: '(max-width: 1439px)',
  overlapping: false,
  priority: 1001,
}];

export const EmpNotebookBreakPointsProvider = {
  provide: BREAKPOINT,
  useValue: NOTEBOOK_BREAKPOINT,
  multi: true,
};
