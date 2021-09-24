import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserdetailschildPopupPage } from './userdetailschild-popup.page';

const routes: Routes = [
  {
    path: '',
    component: UserdetailschildPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserdetailschildPopupPageRoutingModule {}
