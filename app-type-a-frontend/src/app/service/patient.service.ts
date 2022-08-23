import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Patient } from '../model/patient';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService extends GenericService<Patient> {

  /*`*/
  public patientChange = new Subject<Patient[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http,
          `${environment.API_BASE}/patients`);
   }

  setMessageChange(message: string){
    this.messageChange.next(message);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  listPageable(page : number, size: number){
    return this.http.get<any>(`${this.url}/pageable?page=${page}&size=${size}`);
  }
}
