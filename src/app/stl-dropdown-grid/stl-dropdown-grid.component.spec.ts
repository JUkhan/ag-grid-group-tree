import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StlDropdownGridComponent } from './stl-dropdown-grid.component';

describe('StlDropdownGridComponent', () => {
  let component: StlDropdownGridComponent;
  let fixture: ComponentFixture<StlDropdownGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StlDropdownGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StlDropdownGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
