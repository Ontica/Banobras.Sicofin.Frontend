import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsChartListComponent } from './accounts-chart-list.component';

describe('AccountsChartListComponent', () => {
  let component: AccountsChartListComponent;
  let fixture: ComponentFixture<AccountsChartListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsChartListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsChartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
