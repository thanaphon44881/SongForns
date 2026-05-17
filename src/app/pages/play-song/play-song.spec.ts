import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySong } from './play-song';

describe('PlaySong', () => {
  let component: PlaySong;
  let fixture: ComponentFixture<PlaySong>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaySong],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaySong);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
