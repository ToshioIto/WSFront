import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SedeService } from 'src/app/service/sede.service';
import { Sede } from 'src/app/model/sede';

@Component({
  selector: 'app-creacion-edicion',
  templateUrl: './creacion-edicion.component.html',
  styleUrls: ['./creacion-edicion.component.css']
})
export class CreacionEdicionComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  @Input() id: number | null = null;
  sede: Sede = new Sede();
  edicion: boolean = false;
  mensaje: string = '';

  constructor(
    private sedeService: SedeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required]
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
      this.sedeService.listar().subscribe(data => {
        const sedeData = data.find(s => s.id === this.id);
        if (sedeData) {
          this.form.patchValue({
            id: sedeData.id,
            nombre: sedeData.nombre,
            direccion: sedeData.direccion
          });
        }
      });
    }
  }

  aceptar() {
    if (this.form.valid) {
      this.sede.id = this.form.value.id;
      this.sede.nombre = this.form.value.nombre;
      this.sede.direccion = this.form.value.direccion;

      if (this.edicion) {
        this.sedeService.actualizar(this.sede).subscribe(() => {
          this.sedeService.listar().subscribe(data => {
            this.sedeService.setList(data);
            this.router.navigate(['/sedes']);
          });
        });
      } else {
        this.sedeService.registrar(this.sede).subscribe(() => {
          this.sedeService.listar().subscribe(data => {
            this.sedeService.setList(data);
            this.router.navigate(['/sedes']);
          });
        });
      }
    } else {
      this.mensaje = 'Revise los campos obligatorios!';
    }
  }

  cancelar() {
    this.router.navigate(['/sedes']);
  }
}
