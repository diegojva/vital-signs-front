import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { VitalSigns } from 'src/app/model/vital-signs';
import { PatientService } from 'src/app/service/patient.service';
import { VitalSignsService } from 'src/app/service/vital-signs.service';
import { PatientDialogComponent } from '../../patient/patient-dialog/patient-dialog.component';

@Component({
  selector: 'app-vital-signs-form',
  templateUrl: './vital-signs-form.component.html',
  styleUrls: ['./vital-signs-form.component.css']
})
export class VitalSignsFormComponent implements OnInit {

  patients: Patient[];
  id: number;
  isEdit: boolean;
  form: FormGroup;
  maxDate: Date = new Date();


  patientControl: FormControl = new FormControl();
  patientsFiltered$: Observable<Patient[]>;

  constructor(private routeActivated : ActivatedRoute,
              private dialog: MatDialog,
              private specialtyService: VitalSignsService,
              private patientService: PatientService,
              private _snackBar: MatSnackBar,
              private router : Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idVitalSigns' : new FormControl(0),
      'patient' : this.patientControl,
      'date' : new FormControl('',[Validators.required]),
      'temperature' : new FormControl('',[Validators.required]),
      'pulse' : new FormControl('',[Validators.required]),
      'rhythm' : new FormControl('',[Validators.required]),
    });
    this.routeActivated.params.subscribe(data =>{
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

    this.loadInitialData().subscribe(data => {this.patients = data});
    this.patientsFiltered$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));
    this.showMessagePatient();
  }

  loadInitialData(){
    return this.patientService.findAll();
  }

  showMessagePatient(){
    this.patientService.getMessageChange().subscribe( data  =>{
      this._snackBar.open(data, 'OK', {duration: 3000});
    });
  }

  filterPatients(val: any){
    if(val?.idPatient > 0){
      return this.patients?.filter(patient =>
        patient.firstName.toLowerCase().includes(val.firtsName?.toLowerCase())
        || patient.lastName.toLowerCase().includes(val.lastName.toLowerCase())
        || patient.dni.includes(val)
      );
    }else {
      return this.patients?.filter(patient =>
        patient.firstName.toLowerCase().includes(val?.toLowerCase())
        || patient.lastName.toLowerCase().includes(val?.toLowerCase())
        || patient.dni.includes(val)
      );
    }
  }

  initForm(){
    if(this.isEdit){
      this.specialtyService.findById(this.id).subscribe(data =>{
        this.form.patchValue(data);
      });
    }
  }

  get f(){
    return this.form.controls;
  }

  operate(){
    if(this.form.invalid){ return; };

    let specialty = new VitalSigns();

    if(this.isEdit){
      specialty = this.form.value;
      this.specialtyService.update(specialty).subscribe(()=>{
        this.specialtyService.findAll().subscribe(data =>{
          this.specialtyService.setVitalSignsChange(data);
          this.specialtyService.setMessageVitalSigns('UPDATE!')
        })
      });
    }else {
      this.form.controls['pulse'].setValue(`${this.form.controls['pulse'].value} x min`);
      this.form.controls['temperature'].setValue(`${this.form.controls['temperature'].value} °C`);
      this.form.controls['rhythm'].setValue(`${this.form.controls['rhythm'].value} x min`);
      specialty = this.form.value;

      this.specialtyService.save(specialty).pipe(switchMap(() =>{
        return this.specialtyService.findAll();
      }))
      .subscribe(data => {
        this.specialtyService.setVitalSignsChange(data);
        this.specialtyService.setMessageVitalSigns('CREATED!')
      });
    }
    this.router.navigate(['/pages/vital-signs']);
  }

  showPatient(val: any){
    return val ? `${val.firstName} ${val.lastName}` : val;
  }

  openDialog(){
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      width: '750px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result?.event ==='new-patient'){
        this.loadInitialData().subscribe(data => {
          this.patients = data;
          this.patientControl.setValue(this.patients[this.patients.length - 1]);
        });
      }
    });
  }

}
