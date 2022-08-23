import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { PatientDialogComponent } from '../patient-dialog/patient-dialog.component';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(private routeActivated : ActivatedRoute,
              private patientService: PatientService,
              private dialogRef: MatDialogRef<PatientDialogComponent>,
              private router : Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idPatient' : new FormControl(0),
      'firstName' : new FormControl('',[Validators.required,Validators.minLength(2)]),
      'lastName' : new FormControl('',[Validators.required,Validators.minLength(2)]),
      'dni' : new FormControl('',[Validators.required,Validators.maxLength(8),Validators.minLength(8)]),
      'phone' : new FormControl('',[Validators.required,Validators.minLength(9)]),
      'email' : new FormControl('',[Validators.required,Validators.email]),
    });
    this.routeActivated.params.subscribe(data =>{
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm(){
    if(this.isEdit){
      this.patientService.findById(this.id).subscribe(data =>{
        this.form.patchValue(data);
      });
    }
  }

  get f(){
    return this.form.controls;
  }

  operate(){
    if(this.form.invalid){ return; };

    let patient = new Patient();
    patient = this.form.value;

    if(this.isEdit){
      this.patientService.update(patient).subscribe((data2)=>{
        this.patientService.listPageable(0,3).subscribe(data =>{
          this.patientService.patientChange.next(data);
          this.patientService.setMessageChange('UPDATE!')
        })
      });
    }else {
      this.patientService.save(patient).pipe(switchMap(() =>{
        this.dialogSentEvent();
        return this.patientService.listPageable(0,3);
      }))
      .subscribe(data => {
        this.patientService.patientChange.next(data);
        this.patientService.setMessageChange('CREATED!')
      });
    }
    //this.router.navigate(['/pages/patient'])
    this.close();
  }

  close(){
    this.dialogRef._containerInstance != null ? this.dialogRef.close() : this.router.navigate(['/pages/patient']);
  }

  dialogSentEvent(){
    this.dialogRef._containerInstance != null ? this.dialogRef.close({ event: 'new-patient' }) : false;
  }

}
