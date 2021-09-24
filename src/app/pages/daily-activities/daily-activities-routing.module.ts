import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyActivitiesPage } from './daily-activities.page';

const routes: Routes = [
  {
    path: '',
    component: DailyActivitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyActivitiesPageRoutingModule {}
