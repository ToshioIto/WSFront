import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultorioService } from 'src/app/service/consultorio.service';
import { SedeService } from 'src/app/service/sede.service';
import { Consultorio } from 'src/app/model/consultorio';
import { Sede } from 'src/app/model/sede';

@Component({
  selector: 'app-creacion-edicion-consultorio',
  templateUrl: './creacion-edicion-consultorio.component.html',
  styleUrls: ['./creacion-edicion-consultorio.component.css']
})
export class CreacionEdicionConsultorioComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  @Input() id: number | null = null;
  consultorio: Consultorio = new Consultorio();
  sedes: Sede[] = [];
  edicion: boolean = false;
  mensaje: string = '';

  constructor(
    private consultorioService: ConsultorioService,
    private sedeService: SedeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      numero: ['', Validators.required],
      sede: ['', Validators.required]
    });

    this.cargarSedes();

    this.route.params.subscribe(params => {
      this.id = params['id'] ? +params['id'] : null;
      this.edicion = this.id != null;
      if (this.edicion) this.initForm();
    });
  }

  cargarSedes() {
    this.sedeService.listar().subscribe(data => {
      this.sedes = data;
    });
  }

  initForm() {
    if (this.id !== null) {
      this.consultorioService.listar().subscribe(data => {
        const consultorioData = data.find(c => c.id === this.id);
        if (consultorioData) {
          this.form.patchValue({
            id: consultorioData.id,
            numero: consultorioData.numero,
            sede: consultorioData.sede.id
          });
        }
      });
    }
  }

  aceptar() {
    if (this.form.valid) {
      this.consultorio = { ...this.form.value };
      const sedeSeleccionada = this.sedes.find(s => s.id === +this.form.value.sede);

      if (sedeSeleccionada) {
        this.consultorio.sede = sedeSeleccionada;

        const accion = this.edicion ? this.consultorioService.actualizar(this.consultorio) : this.consultorioService.registrar(this.consultorio);
        accion.subscribe(() => {
          this.consultorioService.listar().subscribe(data => {
            this.consultorioService.setList(data);
            this.router.navigate(['/consultorio']);
          });
        });
      } else {
        this.mensaje = 'La sede seleccionada no es válida';
      }
    } else {
      this.mensaje = 'Revise los campos obligatorios!';
    }
  }

  cancelar() {
    this.router.navigate(['/consultorio']);
  }
}
