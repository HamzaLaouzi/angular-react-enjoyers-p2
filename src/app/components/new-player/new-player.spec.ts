import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlayer } from './new-player';

describe('NewPlayer', () => {
  let component: NewPlayer;
  let fixture: ComponentFixture<NewPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
