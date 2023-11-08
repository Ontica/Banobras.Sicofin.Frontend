/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamosInterbancariosEntryHeaderComponent } from './prestamos-interbancarios-entry-header.component';

describe('PrestamosInterbancariosEntryHeaderComponent', () => {
  let component: PrestamosInterbancariosEntryHeaderComponent;
  let fixture: ComponentFixture<PrestamosInterbancariosEntryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestamosInterbancariosEntryHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamosInterbancariosEntryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
