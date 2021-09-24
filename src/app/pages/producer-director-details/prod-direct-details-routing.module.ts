import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdDirectDetailsPage } from './prod-direct-details.page';



const routes: Routes = [
  {
    path: '',
    component: ProdDirectDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdDirectDetailsPageRoutingModule {}
