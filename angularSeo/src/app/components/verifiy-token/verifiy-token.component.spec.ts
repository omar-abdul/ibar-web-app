import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiyTokenComponent } from './verifiy-token.component';

describe('VerifiyTokenComponent', () => {
  let component: VerifiyTokenComponent;
  let fixture: ComponentFixture<VerifiyTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifiyTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiyTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
