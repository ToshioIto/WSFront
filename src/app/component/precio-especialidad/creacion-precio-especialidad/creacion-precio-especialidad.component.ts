import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Especialidad } from 'src/app/model/especialidades';
import { PrecioCita } from 'src/app/model/precioCita';
import { EspecialidadesService } from 'src/app/service/especialidades.service';
import { PrecioCitaService } from 'src/app/service/precio-cita.service';

@Component({
  selector: 'app-creacion-precio-especialidad',
  templateUrl: './creacion-precio-especialidad.component.html',
  styleUrls: ['./creacion-precio-especialidad.component.css']
})
export class CreacionPrecioEspecialidadComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  @Input() id: number | null = null;
  precioCita: PrecioCita = new PrecioCita();
  edicion: boolean = false;
  mensaje: string = '';
  especialidades: Especialidad[] = [];

  constructor(
    private precioCitaService: PrecioCitaService,
    private especialidadService: EspecialidadesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      especialidad: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]]
    });

    this.especialidadService.listar().subscribe(data => {
      this.especialidades = data;
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
  }

  initForm() {
    if (this.edicion && this.id !== null) {
      this.precioCitaService.listar().subscribe(data => {
        const precioCitaData = data.find(p => p.id === this.id);
        if (precioCitaData) {
          this.form.patchValue({
            id: precioCitaData.id,
            especialidad: precioCitaData.especialidad.id,
            precio: precioCitaData.precio
          });
        }
      });
    }
  }

  aceptar() {
    if (this.form.valid) {
      this.precioCita.id = this.form.value.id;
      this.precioCita.especialidad = this.especialidades.find(e => e.id === +this.form.value.especialidad) || new Especialidad();
      this.precioCita.precio = this.form.value.precio;

      if (this.edicion) {
        this.precioCitaService.actualizar(this.precioCita).subscribe(() => {
          this.precioCitaService.listar().subscribe(data => {
            this.precioCitaService.setList(data);
            this.router.navigate(['/precios-cita']);
          });
        });
      } else {
        this.precioCitaService.registrar(this.precioCita).subscribe(() => {
          this.precioCitaService.listar().subscribe(data => {
            this.precioCitaService.setList(data);
            this.router.navigate(['/precios-cita']);
          });
        });
      }
    } else {
      this.mensaje = 'Revise los campos obligatorios!';
    }
  }

  cancelar() {
    this.router.navigate(['/precios-cita']);
  }
}
