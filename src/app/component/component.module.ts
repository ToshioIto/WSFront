import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EspecialidadesComponent } from './especialidades/especialidades.component';
import { SedeComponent } from './sede/sede.component';
import { ConsultorioComponent } from './consultorio/consultorio.component';
import { DoctorComponent } from './doctor/doctor.component';
import { CreacionEdicionComponent } from './sede/creacion-edicion/creacion-edicion.component';
import { ListarEspecialidadesComponent } from './especialidades/listar-especialidades/listar-especialidades.component';
import { ListarDoctoresComponent } from './doctor/listar-doctores/listar-doctores.component';
import { ListarSedesComponent } from './sede/listar-sedes/listar-sedes.component';
import { ListarConsultorioComponent } from './consultorio/listar-consultorio/listar-consultorio.component';
import { CreacionEdicionEspecialidadesComponent } from './especialidades/creacion-edicion-especialidades/creacion-edicion-especialidades.component';
import { CreacionEdicionDoctorComponent } from './doctor/creacion-edicion-doctor/creacion-edicion-doctor.component';
import { CreacionEdicionConsultorioComponent } from './consultorio/creacion-edicion-consultorio/creacion-edicion-consultorio.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HorariosComponent } from './horarios/horarios.component';
import { ListarHorariosComponent } from './horarios/listar-horarios/listar-horarios.component';
import { CreacionHorariosComponent } from './horarios/creacion-horarios/creacion-horarios.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NavbarComponent } from './landing-page/elementos/navbar/navbar.component';
import { FooterComponent } from './landing-page/elementos/footer/footer.component';
import { MainComponent } from './landing-page/rutas/main/main.component';
import { PreguntasComponent } from './landing-page/rutas/preguntas/preguntas.component';
import { CitasComponent } from './landing-page/rutas/citas/citas.component';
import { HistorialComponent } from './landing-page/rutas/historial/historial.component';
import { PrecioEspecialidadComponent } from './precio-especialidad/precio-especialidad.component';
import { ListarPrecioEspecialidadComponent } from './precio-especialidad/listar-precio-especialidad/listar-precio-especialidad.component';
import { CreacionPrecioEspecialidadComponent } from './precio-especialidad/creacion-precio-especialidad/creacion-precio-especialidad.component';
import { ComponentRoutingModule } from './component-routing.module';
import { DialogComponent } from './security/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CredencialesComponent } from './landing-page/rutas/credenciales/credenciales.component';
import { VerCredencialComponent } from './landing-page/rutas/credenciales/ver-credencial/ver-credencial.component';
import { EditarCredencialComponent } from './landing-page/rutas/credenciales/editar-credencial/editar-credencial.component';

@NgModule({
  declarations: [
    EspecialidadesComponent,
    SedeComponent,
    ConsultorioComponent,
    DoctorComponent,
    CreacionEdicionComponent,
    ListarEspecialidadesComponent,
    ListarDoctoresComponent,
    ListarSedesComponent,
    ListarConsultorioComponent,
    CreacionEdicionEspecialidadesComponent,
    CreacionEdicionDoctorComponent,
    CreacionEdicionConsultorioComponent,
    SidebarComponent,
    HorariosComponent,
    ListarHorariosComponent,
    CreacionHorariosComponent,
    LandingPageComponent,
    NavbarComponent,
    FooterComponent,
    MainComponent,
    PreguntasComponent,
    CitasComponent,
    HistorialComponent,
    PrecioEspecialidadComponent,
    ListarPrecioEspecialidadComponent,
    CreacionPrecioEspecialidadComponent,
    DialogComponent,
    CredencialesComponent,
    VerCredencialComponent,
    EditarCredencialComponent
  ],
  imports: [
    CommonModule,
    ComponentRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    FormsModule
  ],
  exports: [
    SidebarComponent,
    NavbarComponent
  ]
})
export class ComponentModule { }
