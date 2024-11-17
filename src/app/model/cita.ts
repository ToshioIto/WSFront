import { Doctor } from './doctor';
import { Consultorio } from './consultorio';
import { Especialidad } from './especialidades';

export class Cita {
    id: number = 0;
    doctor: Doctor = new Doctor();
    especialidad: Especialidad = new Especialidad();
    consultorio: Consultorio = new Consultorio();
    fechaHora: Date = new Date();
}
