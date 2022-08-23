import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { LayoutComponent } from './layout/layout.component';
import { HttpClientModule } from '@angular/common/http';
import { VitalSignsComponent } from './vital-signs/vital-signs.component';
import { PatientComponent } from './patient/patient.component';
import { PatientFormComponent } from './patient/patient-form/patient-form.component';
import { VitalSignsFormComponent } from './vital-signs/vital-signs-form/vital-signs-form.component';
import { PatientDialogComponent } from './patient/patient-dialog/patient-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    LayoutComponent,
    VitalSignsComponent,
    PatientComponent,
    PatientFormComponent,
    VitalSignsFormComponent,
    PatientDialogComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [    {
    provide: MatDialogRef,
    useValue: {}
  }, PatientDialogComponent
  ],
})
export class PagesModule { }
