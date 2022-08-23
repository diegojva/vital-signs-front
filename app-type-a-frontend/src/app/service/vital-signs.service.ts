import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VitalSigns } from '../model/vital-signs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class VitalSignsService extends GenericService<VitalSigns> {

  private vitalSignsChange = new Subject<VitalSigns[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http,
          `${environment.API_BASE}/vitalsigns`);
   }

  setVitalSignsChange(specialtys : VitalSigns[]){
    this.vitalSignsChange.next(specialtys);
  }

  getVitalSignsChange(){
    return this.vitalSignsChange.asObservable();
  }

  setMessageVitalSigns(message: string){
    this.messageChange.next(message);
  }

  getMessageVitalSigns(){
    return this.messageChange.asObservable();
  }
}
