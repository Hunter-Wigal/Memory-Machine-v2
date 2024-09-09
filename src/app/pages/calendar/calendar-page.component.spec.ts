import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarPage } from './calendar-page.component';

describe('CalendarComponent', () => {
  let component: CalendarPage;
  let fixture: ComponentFixture<CalendarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
