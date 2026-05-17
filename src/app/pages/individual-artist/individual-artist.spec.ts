import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualArtist } from './individual-artist';

describe('IndividualArtist', () => {
  let component: IndividualArtist;
  let fixture: ComponentFixture<IndividualArtist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualArtist],
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualArtist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
