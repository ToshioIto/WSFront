import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrecioCita } from 'src/app/model/precioCita';
import { PrecioCitaService } from 'src/app/service/precio-cita.service';
import { LoginService } from 'src/app/service/security/login.service';

@Component({
  selector: 'app-listar-precio-especialidad',
  templateUrl: './listar-precio-especialidad.component.html',
  styleUrls: ['./listar-precio-especialidad.component.css']
})
export class ListarPrecioEspecialidadComponent implements OnInit{
  dataSource: PrecioCita[] = [];
  originalDataSource: PrecioCita[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: PrecioCita[] = [];
  role:string="";
  username:string=""

  constructor(private precioCitaService: PrecioCitaService, private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.verificar();
    this.cargarPreciosCita();
    this.precioCitaService.getList().subscribe(data => {
      this.dataSource = data;
      this.originalDataSource = [...data];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  verificar() {
    this.role=this.loginService.showRole();
    this.username=this.loginService.showUser();
    return this.loginService.verificar();
  }

  cargarPreciosCita() {
    this.precioCitaService.listar().subscribe((data) => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  filter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource = this.originalDataSource.filter(precioCita => 
      precioCita.especialidad.nombre.toLowerCase().includes(filterValue) ||
      precioCita.precio.toString().includes(filterValue)
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

  addPrecioCita() {
    this.router.navigate(['/precios-cita/nuevo']);
  }

  editarPrecioCita(id: number) {
    this.router.navigate(['/precios-cita/ediciones', id]);
  }

  eliminarPrecioCita(id: number) {
    if (confirm('¿Está seguro de eliminar este precio de cita?')) {
      this.precioCitaService.eliminar(id).subscribe({
        next: () => {
          alert('Precio de cita eliminado');
          this.cargarPreciosCita();
        },
        error: (err) => {
          alert('No se puede eliminar este precio. Puede que esté relacionado con otras tablas.');
        }
      });
    }
  }
}
