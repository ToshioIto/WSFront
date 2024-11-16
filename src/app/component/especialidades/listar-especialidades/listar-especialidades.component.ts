import { Component, OnInit } from '@angular/core';
import { Especialidad } from 'src/app/model/especialidades';
import { EspecialidadesService } from 'src/app/service/especialidades.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/security/login.service';

@Component({
  selector: 'app-listar-especialidades',
  templateUrl: './listar-especialidades.component.html',
  styleUrls: ['./listar-especialidades.component.css']
})
export class ListarEspecialidadesComponent implements OnInit {
  dataSource: Especialidad[] = [];
  originalDataSource: Especialidad[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: Especialidad[] = [];
  role: string = "";

  constructor(private especialidadesService: EspecialidadesService, private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.verificar();
    this.cargarEspecialidades();
    this.especialidadesService.getList().subscribe(data => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }

  cargarEspecialidades() {
    this.especialidadesService.listar().subscribe((data) => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  filter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource = this.originalDataSource.filter(especialidad => 
      especialidad.nombre.toLowerCase().includes(filterValue) ||
      especialidad.descripcion.toLowerCase().includes(filterValue)
    );
    this.totalItems = this.dataSource.length;
    this.currentPage = 1;
    this.paginarDatos();
  }

  changePageSize(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.paginarDatos();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginarDatos();
    }
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.paginarDatos();
    }
  }

  paginarDatos() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.dataSource.slice(start, end);
  }

  addEspecialidad() {
    this.router.navigate(['/especialidades/nuevo']);
  }
  navPreciosCitas() {
    this.router.navigate(['/precios-cita'])
  }

  editarEspecialidad(id: number) {
    this.router.navigate(['/especialidades/ediciones', id]);
  }

  eliminarEspecialidad(id: number) {
    if (confirm('¿Está seguro de eliminar esta especialidad?')) {
      this.especialidadesService.eliminar(id).subscribe({
        next: () => {
          alert('Especialidad eliminada');
          this.cargarEspecialidades();
        },
        error: (err) => {
          alert('No se puede eliminar esta especialidad. Puede que esté relacionada con otras tablas.');
        }
      });
    }
  }
}
