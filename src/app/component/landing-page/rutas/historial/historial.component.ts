import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cita } from 'src/app/model/cita';
import { CitasService } from 'src/app/service/citas.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit{
  dataSource: Cita[] = [];
  originalDataSource: Cita[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: Cita[] = [];

  constructor(private citasService: CitasService, private router: Router) {}

  ngOnInit(): void {
    this.cargarCitas();
    this.citasService.getList().subscribe(data => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  cargarCitas() {
    this.citasService.listar().subscribe((data) => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  filter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource = this.originalDataSource.filter(cita => 
      cita.doctor.nombre.toLowerCase().includes(filterValue) ||
      cita.consultorio.numero.toLowerCase().includes(filterValue) ||
      cita.especialidad.nombre.toLowerCase().includes(filterValue)
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

  editarCita(id: number) {
    this.router.navigate(['/home/citas', id]);
  }

  eliminarCita(id: number) {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
      this.citasService.eliminar(id).subscribe({
        next: () => {
          alert('Cita eliminada');
          this.cargarCitas();
        },
        error: (err) => {
          alert('No se puede eliminar esta cita. Puede que esté relacionada con otras tablas.');
        }
      });
    }
  }
}
