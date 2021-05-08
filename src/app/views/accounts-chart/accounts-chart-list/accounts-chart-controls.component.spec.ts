import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsChartControlsComponent } from './accounts-chart-controls.component';

describe('AccountsChartControlsComponent', () => {
  let component: AccountsChartControlsComponent;
  let fixture: ComponentFixture<AccountsChartControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsChartControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsChartControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
