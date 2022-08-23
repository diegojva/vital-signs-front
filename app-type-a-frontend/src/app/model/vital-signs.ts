import { Patient } from "./patient";

export class VitalSigns{
  idVitalSigns: number;
  date: string;
  temperature: string;
  pulse: string;
  rhythm: string;
  patient: Patient;
}
