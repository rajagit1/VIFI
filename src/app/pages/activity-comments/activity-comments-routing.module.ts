import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityCommentsPage } from './activity-comments.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityCommentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityCommentsPageRoutingModule {}
