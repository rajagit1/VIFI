import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TechnicianDetailsPage } from './technician-details.page';

const routes: Routes = [
  {
    path: '',
    component: TechnicianDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TechnicianDetailsPageRoutingModule {}
