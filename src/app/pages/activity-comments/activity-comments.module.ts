import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityCommentsPageRoutingModule } from './activity-comments-routing.module';

import { ActivityCommentsPage } from './activity-comments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityCommentsPageRoutingModule
  ],
  declarations: [ActivityCommentsPage]
})
export class ActivityCommentsPageModule {}
