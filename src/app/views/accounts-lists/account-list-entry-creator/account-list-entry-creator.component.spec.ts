/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListEntryCreatorComponent } from './account-list-entry-creator.component';

describe('AccountListEntryCreatorComponent', () => {
  let component: AccountListEntryCreatorComponent;
  let fixture: ComponentFixture<AccountListEntryCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountListEntryCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountListEntryCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
