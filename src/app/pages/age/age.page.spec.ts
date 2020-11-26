import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgePage } from './age.page';

describe('AgePage', () => {
  let component: AgePage;
  let fixture: ComponentFixture<AgePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
