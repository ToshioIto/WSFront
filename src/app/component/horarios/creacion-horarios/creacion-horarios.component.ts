import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HorarioService } from 'src/app/service/horario.service';
import { DoctorService } from 'src/app/service/doctor.service';
import { Horario } from 'src/app/model/horario';
import { Doctor } from 'src/app/model/doctor';

@Component({
  selector: 'app-creacion-horarios',
  templateUrl: './creacion-horarios.component.html',
  styleUrls: ['./creacion-horarios.component.css']
})
export class CreacionHorariosComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  @Input() id: number | null = null;
  horario: Horario = new Horario();
  edicion: boolean = false;
  mensaje: string = '';
  doctores: Doctor[] = [];

  constructor(
    private horarioService: HorarioService,
    private doctorService: DoctorService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      turno: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      doctor: ['', Validators.required]
    });

    this.doctorService.listar().subscribe(data => {
      this.doctores = data;
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
      this.horarioService.listar().subscribe(data => {
        const horarioData = data.find(h => h.id === this.id);
        if (horarioData) {
          this.form.patchValue({
            id: horarioData.id,
            turno: horarioData.turno,
            horaInicio: horarioData.horaInicio,
            horaFin: horarioData.horaFin,
            doctor: horarioData.doctor.id
          });
        }
      });
    }
  }

  aceptar() {
    if (this.form.valid) {
      this.horario.id = this.form.value.id;
      this.horario.turno = this.form.value.turno;
      this.horario.horaInicio = this.form.value.horaInicio;
      this.horario.horaFin = this.form.value.horaFin;
      this.horario.doctor = this.doctores.find(d => d.id === +this.form.value.doctor) || new Doctor();

      if (this.edicion) {
        this.horarioService.actualizar(this.horario).subscribe(() => {
          this.horarioService.listar().subscribe(data => {
            this.horarioService.setList(data);
            this.router.navigate(['/horarios']);
          });
        });
      } else {
        this.horarioService.registrar(this.horario).subscribe(() => {
          this.horarioService.listar().subscribe(data => {
            this.horarioService.setList(data);
            this.router.navigate(['/horarios']);
          });
        });
      }
    } else {
      this.mensaje = 'Revise los campos obligatorios!';
    }
  }

  cancelar() {
    this.router.navigate(['/horarios']);
  }
}
