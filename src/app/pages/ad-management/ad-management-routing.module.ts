import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdManagementPage } from './ad-management.page';

const routes: Routes = [
  {
    path: '',
    component: AdManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdManagementPageRoutingModule {}
