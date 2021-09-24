import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostActivitiesPage } from './post-activities.page';

const routes: Routes = [
  {
    path: '',
    component: PostActivitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostActivitiesPageRoutingModule {}
