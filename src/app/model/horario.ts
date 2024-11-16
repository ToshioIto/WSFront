import { Doctor } from "./doctor";

export class Horario {
    id: number = 0;
    turno: string = '';
    horaInicio: Date = new Date();
    horaFin: Date = new Date();
    doctor: Doctor = new Doctor();
}
