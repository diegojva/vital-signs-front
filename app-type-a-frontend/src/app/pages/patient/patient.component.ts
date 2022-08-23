import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  displayedColumns: string[] = ['idPatient', 'firstName', 'lastName', 'dni', 'phone', 'email','actions'];
  dataSource: MatTableDataSource<Patient>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number;

  constructor(private patientService: PatientService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.patientService.patientChange.subscribe(data =>{
      this.createTable(data);
    });

    this.patientService.getMessageChange().subscribe( data  =>{
      this._snackBar.open(data, 'OK', {duration: 3000});
    })

    this.patientService.listPageable(0,3).subscribe(data =>{
        this.createTable(data);
    });
   /* this.patientService.findAll().subscribe(patients => {
      this.createTable(patients);
    });*/
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(idPatient : number){


    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.delete(idPatient).pipe(switchMap(()=>{
          return this.patientService.listPageable(0,this.paginator.pageSize);
        }))
        .subscribe(data => {
          this.patientService.patientChange.next(data);
          //this.patientService.setMessageChange('DELETED!')
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        })
      }
    })
  }

  createTable(patients: any){
    this.dataSource = new MatTableDataSource(patients.content);
    this.totalElements = patients.totalElements;
    this.paginator.pageSize = patients.size;
  }

  showMore(event?: any){
    this.patientService.listPageable(event.pageIndex, event.pageSize).subscribe(data =>{
      this.createTable(data);
    });
  }

}
