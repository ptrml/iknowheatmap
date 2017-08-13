import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IknowHeatmapComponent } from './iknow-heatmap.component';

describe('IknowHeatmapComponent', () => {
  let component: IknowHeatmapComponent;
  let fixture: ComponentFixture<IknowHeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IknowHeatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IknowHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
