import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsExternalComponent } from './forms-external.component';

describe('FormsExternalComponent', () => {
  let component: FormsExternalComponent;
  let fixture: ComponentFixture<FormsExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormsExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
