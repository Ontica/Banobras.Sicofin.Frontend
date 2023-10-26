/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliacionDerivadosEntryHeaderComponent } from './conciliacion-derivados-entry-header.component';

describe('ConciliacionDerivadosEntryHeaderComponent', () => {
  let component: ConciliacionDerivadosEntryHeaderComponent;
  let fixture: ComponentFixture<ConciliacionDerivadosEntryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConciliacionDerivadosEntryHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConciliacionDerivadosEntryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
