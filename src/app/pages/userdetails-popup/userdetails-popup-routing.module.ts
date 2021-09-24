import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserdetailsPopupPage } from './userdetails-popup.page';

const routes: Routes = [
  {
    path: '',
    component: UserdetailsPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserdetailsPopupPageRoutingModule {}
