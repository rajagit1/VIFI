import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VifiNotifyPage } from './vifi-notify.page';

const routes: Routes = [
  {
    path: '',
    component: VifiNotifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VifiNotifyPageRoutingModule {}
