import { Component, OnInit } from '@angular/core';
import { Sede } from 'src/app/model/sede';
import { SedeService } from 'src/app/service/sede.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/security/login.service';

@Component({
  selector: 'app-listar-sedes',
  templateUrl: './listar-sedes.component.html',
  styleUrls: ['./listar-sedes.component.css']
})
export class ListarSedesComponent implements OnInit {
  dataSource: Sede[] = [];
  originalDataSource: Sede[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: Sede[] = [];
  role:string="";
  username:string="";

  constructor(private sedeService: SedeService, private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.cargarSedes();
    this.verificar();
    this.sedeService.getList().subscribe(data => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  cargarSedes() {
    this.sedeService.listar().subscribe((data) => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  verificar() {
    this.role=this.loginService.showRole();
    this.username=this.loginService.showUser();
    return this.loginService.verificar();
  }

  filter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource = this.originalDataSource.filter(sede => 
      sede.nombre.toLowerCase().includes(filterValue) ||
      sede.direccion.toLowerCase().includes(filterValue)
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

  addSede() {
    this.router.navigate(['/sedes/nuevo']);
  }

  editarSede(id: number) {
    this.router.navigate(['/sedes/ediciones', id]);
  }

  eliminarSede(id: number) {
    if (confirm('¿Está seguro de eliminar esta sede?')) {
      this.sedeService.eliminar(id).subscribe({
        next: () => {
          alert('Sede eliminada');
          this.cargarSedes();
        },
        error: (err) => {
          alert('No se puede eliminar esta sede. Puede que esté relacionada con otras tablas.');
        }
      });
    }
  }
}
