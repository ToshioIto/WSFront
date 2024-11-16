import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitasService } from 'src/app/service/citas.service';
import { DoctorService } from 'src/app/service/doctor.service';
import { ConsultorioService } from 'src/app/service/consultorio.service';
import { Cita } from 'src/app/model/cita';
import { Doctor } from 'src/app/model/doctor';
import { Especialidad } from 'src/app/model/especialidades';
import { Consultorio } from 'src/app/model/consultorio';
import { EspecialidadesService } from 'src/app/service/especialidades.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number | null = null;
  cita: Cita = new Cita();
  edicion: boolean = false;
  mensaje: string = '';
  doctores: Doctor[] = [];
  especialidades: Especialidad[] = [];
  consultorios: Consultorio[] = [];
  showCancelButton: boolean = false;

  constructor(
    private citasService: CitasService,
    private doctorService: DoctorService,
    private especialidadService: EspecialidadesService,
    private consultorioService: ConsultorioService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      doctor: ['', Validators.required],
      especialidad: ['', Validators.required],
      consultorio: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });
  
    this.doctorService.listar().subscribe(data => {
      this.doctores = data;
    });
  
    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
    });
  
    this.consultorioService.listar().subscribe(data => {
      this.consultorios = data;
    });

    this.route.params.subscribe(params => {
      this.id = params['id'] ? +params['id'] : null;
      if (this.id) {
        this.edicion = true;
        this.initForm();
      } else {
        this.edicion = false;
      }
    });

    this.form.valueChanges.subscribe(() => {
      this.showCancelButton = this.form.dirty;
    });
  }  

  initForm() {
    if (this.edicion && this.id !== null) {
      this.citasService.listar().subscribe(data => {
        const citaData = data.find(c => c.id === this.id);
        if (citaData) {
          const fecha = new Date(citaData.fechaHora);
          this.form.patchValue({
            id: citaData.id,
            doctor: citaData.doctor.id,
            especialidad: citaData.especialidad.id,
            consultorio: citaData.consultorio.id,
            fecha: fecha.toISOString().split('T')[0],
            hora: fecha.toTimeString().split(' ')[0]
          });
        }
      });
    }
  }

  aceptar() {
    if (this.form.valid) {
      this.cita.id = this.form.value.id;
      this.cita.doctor = this.doctores.find(d => d.id === +this.form.value.doctor) || new Doctor();
      this.cita.especialidad = this.especialidades.find(e => e.id === +this.form.value.especialidad) || new Especialidad();
      this.cita.consultorio = this.consultorios.find(c => c.id === +this.form.value.consultorio) || new Consultorio();
      const fecha = this.form.value.fecha;
      const hora = this.form.value.hora;
      this.cita.fechaHora = new Date(`${fecha}T${hora}`);

      if (this.edicion) {
        this.citasService.actualizar(this.cita).subscribe(() => {
          this.citasService.listar().subscribe(data => {
            this.citasService.setList(data);
            this.resetForm();
            this.mensaje = 'Cita actualizada con éxito!';
          });
        });
      } else {
        this.citasService.registrar(this.cita).subscribe(() => {
          this.citasService.listar().subscribe(data => {
            this.citasService.setList(data);
            this.resetForm();
            this.mensaje = 'Cita registrada con éxito!';
          });
        });
      }
    } else {
      this.mensaje = 'Revise los campos obligatorios!';
    }
  }

  resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.mensaje = '';
    this.showCancelButton = false;
  }

  cancelar() {
    this.resetForm();
  }
}
