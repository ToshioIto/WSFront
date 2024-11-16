import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { PreguntasComponent } from './landing-page/rutas/preguntas/preguntas.component';
import { MainComponent } from './landing-page/rutas/main/main.component';
import { CitasComponent } from './landing-page/rutas/citas/citas.component';
import { HistorialComponent } from './landing-page/rutas/historial/historial.component';

import { DoctorComponent } from './doctor/doctor.component';
import { CreacionEdicionDoctorComponent } from './doctor/creacion-edicion-doctor/creacion-edicion-doctor.component';

import { HorariosComponent } from './horarios/horarios.component';
import { CreacionHorariosComponent } from './horarios/creacion-horarios/creacion-horarios.component';

import { SedeComponent } from './sede/sede.component';
import { CreacionEdicionComponent } from './sede/creacion-edicion/creacion-edicion.component';

import { EspecialidadesComponent } from './especialidades/especialidades.component';
import { CreacionEdicionEspecialidadesComponent } from './especialidades/creacion-edicion-especialidades/creacion-edicion-especialidades.component';

import { PrecioEspecialidadComponent } from './precio-especialidad/precio-especialidad.component';

import { ConsultorioComponent } from './consultorio/consultorio.component';
import { CreacionEdicionConsultorioComponent } from './consultorio/creacion-edicion-consultorio/creacion-edicion-consultorio.component';
import { CreacionPrecioEspecialidadComponent } from './precio-especialidad/creacion-precio-especialidad/creacion-precio-especialidad.component';
import { GuardService } from '../service/security/guard.service';
import { CredencialesComponent } from './landing-page/rutas/credenciales/credenciales.component';
import { EditarCredencialComponent } from './landing-page/rutas/credenciales/editar-credencial/editar-credencial.component';

const routes: Routes = [
  {
    path: 'home',
    component: LandingPageComponent,
    children: [
      { path: '', component: MainComponent },
      { path: 'preguntas', component: PreguntasComponent },
      { path: 'citas', component: CitasComponent, canActivate: [GuardService] },
      { path: 'citas/:id', component: CitasComponent, canActivate: [GuardService] },
      { path: 'historial', component: HistorialComponent, canActivate: [GuardService] },
      { path: 'ver-perfil', component: CredencialesComponent, canActivate: [GuardService] },
      { path: 'editar-perfil', component: EditarCredencialComponent, canActivate: [GuardService] },
    ],
  },
  {
    path: 'doctor',
    component: DoctorComponent,
    children: [
      { path: 'nuevo', component: CreacionEdicionDoctorComponent },
      { path: 'ediciones/:id', component: CreacionEdicionDoctorComponent },
    ],
  },
  {
    path: 'horarios',
    component: HorariosComponent,
    children: [
      { path: 'nuevo', component: CreacionHorariosComponent },
      { path: 'ediciones/:id', component: CreacionHorariosComponent },
    ],
  },
  {
    path: 'sedes',
    component: SedeComponent,
    children: [
      { path: 'nuevo', component: CreacionEdicionComponent },
      { path: 'ediciones/:id', component: CreacionEdicionComponent },
    ],
  },
  {
    path: 'especialidades',
    component: EspecialidadesComponent,
    children: [
      { path: 'nuevo', component: CreacionEdicionEspecialidadesComponent },
      { path: 'ediciones/:id', component: CreacionEdicionEspecialidadesComponent },
    ],
  },
  {
    path: 'precios-cita',
    component: PrecioEspecialidadComponent,
    children: [
      { path: 'nuevo', component: CreacionPrecioEspecialidadComponent },
      { path: 'ediciones/:id', component: CreacionPrecioEspecialidadComponent },
    ],
  },
  {
    path: 'consultorio',
    component: ConsultorioComponent,
    children: [
      { path: 'nuevo', component: CreacionEdicionConsultorioComponent },
      { path: 'ediciones/:id', component: CreacionEdicionConsultorioComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentRoutingModule {}
