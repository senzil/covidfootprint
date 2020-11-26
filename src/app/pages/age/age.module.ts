import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgePageRoutingModule } from './age-routing.module';

import { AgePage } from './age.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgePageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [AgePage]
})
export class AgePageModule {}
