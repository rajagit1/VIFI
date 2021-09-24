import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilterListPageRoutingModule } from './filter-list-routing.module';

import { FilterListPage } from './filter-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterListPageRoutingModule
  ]
})
export class FilterListPageModule {}
