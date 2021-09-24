import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapTechniciansComponent } from './map-technicians.component';



const routes: Routes = [
  {
    path: '',
    component: MapTechniciansComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapTechniciansRoutingModule {}
