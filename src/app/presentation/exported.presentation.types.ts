/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


import { MainLayoutActions, MainLayoutSelectors } from './main-layout/_main-layout.presentation.types';
export * from './main-layout/_main-layout.presentation.types';

import { SMSelectors } from './security-management/_security.management.presentation.types';
export * from './security-management/_security.management.presentation.types';

import { FAActions, FACommands, FAEffects, FASelectors } from './financial-accounting/_financial.accounting.presentation.types';
export * from './financial-accounting/_financial.accounting.presentation.types';


/* Exportation types */

export type ActionType = MainLayoutActions | FAActions;

export type CommandType = FACommands;

export type StateEffect = FAEffects;

export type StateSelector = MainLayoutSelectors | SMSelectors | FASelectors;
