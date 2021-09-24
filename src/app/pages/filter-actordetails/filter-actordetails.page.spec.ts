import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterActordetailsPage } from './filter-actordetails.page';

describe('FilterActordetailsPage', () => {
  let component: FilterActordetailsPage;
  let fixture: ComponentFixture<FilterActordetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterActordetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterActordetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
