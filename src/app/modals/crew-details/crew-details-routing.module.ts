import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrewDetailsPage } from './crew-details.page';

const routes: Routes = [
  {
    path: '',
    component: CrewDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrewDetailsPageRoutingModule {}
