import { Component, OnInit } from '@angular/core';
import { Doctor } from 'src/app/model/doctor';
import { DoctorService } from 'src/app/service/doctor.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/security/login.service';

@Component({
  selector: 'app-listar-doctores',
  templateUrl: './listar-doctores.component.html',
  styleUrls: ['./listar-doctores.component.css']
})
export class ListarDoctoresComponent implements OnInit {
  dataSource: Doctor[] = [];
  originalDataSource: Doctor[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: Doctor[] = [];
  role: string = "";

  constructor(private doctorService: DoctorService, private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.cargarDoctores();
    this.verificar();
    this.doctorService.getList().subscribe(data => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  cargarDoctores() {
    this.doctorService.listar().subscribe((data) => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  addDoctor() {
    this.router.navigate(['/doctor/nuevo']);
  }
  navHorarios() {
    this.router.navigate(['/horarios']);
  }

  editarDoctor(id: number) {
    this.router.navigate(['/doctor/ediciones', id]);
  }

  eliminarDoctor(id: number) {
    if (confirm('¿Está seguro de eliminar este doctor?')) {
      this.doctorService.eliminar(id).subscribe({
        next: () => {
          alert('Doctor eliminado');
          this.cargarDoctores();
        },
        error: (err) => {
          alert('No se puede eliminar este doctor. Puede que esté relacionado con otras tablas.');
        }
      });
    }
  }

  filter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource = this.originalDataSource.filter(doctor => 
      doctor.nombre.toLowerCase().includes(filterValue) ||
      doctor.numeroColegiatura.toLowerCase().includes(filterValue) ||
      doctor.correo.toLowerCase().includes(filterValue) ||
      doctor.celular.includes(filterValue) ||
      doctor.especialidad.nombre.toLowerCase().includes(filterValue)
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

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }

}
