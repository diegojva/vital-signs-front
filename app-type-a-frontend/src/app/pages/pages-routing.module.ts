import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../service/guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientFormComponent } from './patient/patient-form/patient-form.component';
import { PatientComponent } from './patient/patient.component';
import { VitalSignsFormComponent } from './vital-signs/vital-signs-form/vital-signs-form.component';
import { VitalSignsComponent } from './vital-signs/vital-signs.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'patient',
    component: PatientComponent,
    children: [
      {
        path: 'new',
        component: PatientFormComponent,
      },
      {
        path: 'edit/:id',
        component: PatientFormComponent,
      },
    ], canActivate: [GuardService]
  },
  {
    path: 'vital-signs',
    component: VitalSignsComponent,
    children: [
      {
        path: 'new',
        component: VitalSignsFormComponent,
      },
      {
        path: 'edit/:id',
        component: VitalSignsFormComponent,
      },
    ], canActivate: [GuardService]
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
