import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WizardPageRoutingModule } from './wizard-routing.module';

import { WizardPage } from './wizard.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WizardPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [WizardPage]
})
export class WizardPageModule {}
