import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsChartMainPageComponent } from './accounts-chart-main-page.component';

describe('AccountsChartMainPageComponent', () => {
  let component: AccountsChartMainPageComponent;
  let fixture: ComponentFixture<AccountsChartMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsChartMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsChartMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
