import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyActivitiesPageRoutingModule } from './daily-activities-routing.module';

import { DailyActivitiesPage } from './daily-activities.page';
import { ActivityCommentsPage } from '../activity-comments/activity-comments.page';
import { ActivityCommentsPageModule } from '../activity-comments/activity-comments.module';
import { PostActivitiesPageModule } from '../post-activities/post-activities.module';
import { PostActivitiesPage } from '../post-activities/post-activities.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyActivitiesPageRoutingModule,
    PostActivitiesPageModule,
    ActivityCommentsPageModule
  ],
  declarations: [
    DailyActivitiesPage
  ],
  entryComponents: [
    DailyActivitiesPage,ActivityCommentsPage,PostActivitiesPage
  ]
})
export class DailyActivitiesPageModule {}
