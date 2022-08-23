import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { VitalSigns } from 'src/app/model/vital-signs';
import { VitalSignsService } from 'src/app/service/vital-signs.service';

@Component({
  selector: 'app-vital-signs',
  templateUrl: './vital-signs.component.html',
  styleUrls: ['./vital-signs.component.css']
})
export class VitalSignsComponent implements OnInit {

  displayedColumns: string[] = ['idVitalSigns', 'patient', 'date','temperature','pulse','rhythm','actions'];
  dataSource: MatTableDataSource<VitalSigns>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private vitalSignsService: VitalSignsService,
              private _snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.vitalSignsService.getVitalSignsChange().subscribe(specialtys =>{
      this.createTable(specialtys);
    });

    this.vitalSignsService.getMessageVitalSigns().subscribe( data  =>{
      this._snackBar.open(data, 'OK', {duration: 3000});
    })

    this.vitalSignsService.findAll().subscribe(specialtys => {
      this.createTable(specialtys);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(idSpecialty : number){
    this.vitalSignsService.delete(idSpecialty).pipe(switchMap(()=>{
      return this.vitalSignsService.findAll();
    }))
    .subscribe(data => {
      this.vitalSignsService.setVitalSignsChange(data);
      this.vitalSignsService.setMessageVitalSigns('DELETED!')
    })
  }

  createTable(specialtys: VitalSigns[]){
    this.dataSource = new MatTableDataSource(specialtys);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkChildren(){
    return this.activatedRoute.children.length != 0;
  }

}
