import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from 'src/app/service/doctor.service';
import { Doctor } from 'src/app/model/doctor';
import { Especialidad } from 'src/app/model/especialidades';
import { EspecialidadesService } from 'src/app/service/especialidades.service';

@Component({
  selector: 'app-creacion-edicion-doctor',
  templateUrl: './creacion-edicion-doctor.component.html',
  styleUrls: ['./creacion-edicion-doctor.component.css']
})
export class CreacionEdicionDoctorComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  @Input() id: number | null = null;
  doctor: Doctor = new Doctor();
  especialidades: Especialidad[] = [];
  edicion: boolean = false;
  mensaje: string = '';

  constructor(
    private doctorService: DoctorService,
    private especialidadesService: EspecialidadesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      numeroColegiatura: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', Validators.required],
      especialidad: ['', Validators.required]
    });

    this.cargarEspecialidades();

    this.route.params.subscribe(params => {
      this.id = params['id'] ? +params['id'] : null;
      this.edicion = this.id != null;
      if (this.edicion) this.initForm();
    });
  }

  cargarEspecialidades() {
    this.especialidadesService.listar().subscribe(data => {
      this.especialidades = data;
    });
  }

  initForm() {
    if (this.id !== null) {
      this.doctorService.listar().subscribe(data => {
        const doctorData = data.find(d => d.id === this.id);
        if (doctorData) {
          this.form.patchValue({
            id: doctorData.id,
            nombre: doctorData.nombre,
            numeroColegiatura: doctorData.numeroColegiatura,
            correo: doctorData.correo,
            celular: doctorData.celular,
            especialidad: doctorData.especialidad.id
          });
        }
      });
    }
  }

  aceptar() {
    if (this.form.valid) {
      this.doctor = { ...this.form.value };
      const especialidadSeleccionada = this.especialidades.find(e => e.id === +this.form.value.especialidad);

      if (especialidadSeleccionada) {
        this.doctor.especialidad = especialidadSeleccionada;

        const accion = this.edicion ? this.doctorService.actualizar(this.doctor) : this.doctorService.registrar(this.doctor);
        accion.subscribe(() => {
          this.doctorService.listar().subscribe(data => {
            this.doctorService.setList(data);
            this.router.navigate(['/doctor']);
          });
        });
      } else {
        this.mensaje = 'La especialidad seleccionada no es válida';
      }
    } else {
      this.mensaje = 'Revise los campos obligatorios!';
    }
  }

  cancelar() {
    this.router.navigate(['/doctor']);
  }
}
