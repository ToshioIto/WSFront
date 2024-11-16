import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Especialidad } from 'src/app/model/especialidades';
import { EspecialidadesService } from 'src/app/service/especialidades.service';

@Component({
  selector: 'app-creacion-edicion-especialidades',
  templateUrl: './creacion-edicion-especialidades.component.html',
  styleUrls: ['./creacion-edicion-especialidades.component.css']
})
export class CreacionEdicionEspecialidadesComponent implements OnInit{
  form: FormGroup = new FormGroup({});
  @Input() id: number | null = null;
  especialidad: Especialidad = new Especialidad();
  edicion: boolean = false;
  mensaje: string = '';

  constructor(
    private especialidadesService: EspecialidadesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
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
      this.especialidadesService.listar().subscribe(data => {
        const especialidadData = data.find(e => e.id === this.id);
        if (especialidadData) {
          this.form.patchValue({
            id: especialidadData.id,
            nombre: especialidadData.nombre,
            descripcion: especialidadData.descripcion
          });
        }
      });
    }
  }

  aceptar() {
    if (this.form.valid) {
      this.especialidad.id = this.form.value.id;
      this.especialidad.nombre = this.form.value.nombre;
      this.especialidad.descripcion = this.form.value.descripcion;

      if (this.edicion) {
        this.especialidadesService.actualizar(this.especialidad).subscribe(() => {
          this.especialidadesService.listar().subscribe(data => {
            this.especialidadesService.setList(data);
            this.router.navigate(['/especialidades']);
          });
        });
      } else {
        this.especialidadesService.registrar(this.especialidad).subscribe(() => {
          this.especialidadesService.listar().subscribe(data => {
            this.especialidadesService.setList(data);
            this.router.navigate(['/especialidades']);
          });
        });
      }
    } else {
      this.mensaje = 'Revise los campos obligatorios!';
    }
  }

  cancelar() {
    this.router.navigate(['/especialidades']);
  }

}
