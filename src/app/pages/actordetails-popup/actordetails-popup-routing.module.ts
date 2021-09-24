import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActordetailsPopupPage } from './actordetails-popup.page';

const routes: Routes = [
  {
    path: '',
    component: ActordetailsPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActordetailsPopupPageRoutingModule {}
