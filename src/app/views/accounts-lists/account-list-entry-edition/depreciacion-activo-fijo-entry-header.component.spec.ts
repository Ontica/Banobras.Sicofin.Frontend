/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciacionActivoFijoEntryHeaderComponent } from './depreciacion-activo-fijo-entry-header.component';

describe('DepreciacionActivoFijoEntryHeaderComponent', () => {
  let component: DepreciacionActivoFijoEntryHeaderComponent;
  let fixture: ComponentFixture<DepreciacionActivoFijoEntryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciacionActivoFijoEntryHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepreciacionActivoFijoEntryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
