/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingCataloguesAndRulesWorkspaceComponent } from './accounting-catalogues-and-rules-workspace.component';


describe('AccountingCataloguesAndRulesWorkspaceComponent', () => {
  let component: AccountingCataloguesAndRulesWorkspaceComponent;
  let fixture: ComponentFixture<AccountingCataloguesAndRulesWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingCataloguesAndRulesWorkspaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingCataloguesAndRulesWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
