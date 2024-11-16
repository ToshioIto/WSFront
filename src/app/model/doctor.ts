import { Consultorio } from "./consultorio";
import { Especialidad } from "./especialidades";

export class Doctor {
    id: number = 0;
    nombre: string = '';
    numeroColegiatura: string = '';
    correo: string = '';
    celular: string = '';
    especialidad: Especialidad = new Especialidad();

}