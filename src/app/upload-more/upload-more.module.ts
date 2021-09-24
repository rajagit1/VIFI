import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadMorePageRoutingModule } from './upload-more-routing.module';

import { UploadMorePage } from './upload-more.page';
import { FileSizeFormatPipe } from '../file-size-pipe.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadMorePageRoutingModule
  ],
  declarations: [UploadMorePage,FileSizeFormatPipe]
})
export class UploadMorePageModule {}
