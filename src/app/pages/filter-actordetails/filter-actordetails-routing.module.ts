import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterActordetailsPage } from './filter-actordetails.page';

const routes: Routes = [
  {
    path: '',
    component: FilterActordetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterActordetailsPageRoutingModule {}
