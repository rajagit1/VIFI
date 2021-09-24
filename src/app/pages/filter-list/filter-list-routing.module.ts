import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilterListPage } from './filter-list.page';

const routes: Routes = [
  {
    path: '',
    component: FilterListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterListPageRoutingModule {}
