import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadMorePage } from './upload-more.page';

const routes: Routes = [
  {
    path: '',
    component: UploadMorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadMorePageRoutingModule {}
