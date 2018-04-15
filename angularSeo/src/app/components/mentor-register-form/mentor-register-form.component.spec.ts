import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorRegisterFormComponent } from './mentor-register-form.component';

describe('MentorRegisterFormComponent', () => {
  let component: MentorRegisterFormComponent;
  let fixture: ComponentFixture<MentorRegisterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorRegisterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
