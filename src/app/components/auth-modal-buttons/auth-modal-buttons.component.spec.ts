import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModalButtonsComponent } from './auth-modal-buttons.component';

describe('AuthModalButtonsComponent', () => {
  let component: AuthModalButtonsComponent;
  let fixture: ComponentFixture<AuthModalButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModalButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthModalButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
