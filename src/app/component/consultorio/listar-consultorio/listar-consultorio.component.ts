import { Component, OnInit } from '@angular/core';
import { Consultorio } from 'src/app/model/consultorio';
import { ConsultorioService } from 'src/app/service/consultorio.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/security/login.service';

@Component({
  selector: 'app-listar-consultorio',
  templateUrl: './listar-consultorio.component.html',
  styleUrls: ['./listar-consultorio.component.css']
})
export class ListarConsultorioComponent implements OnInit {
  dataSource: Consultorio[] = [];
  originalDataSource: Consultorio[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: Consultorio[] = [];
  role: string = "";
  username:string="";

  constructor(private consultorioService: ConsultorioService, private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.verificar();
    this.cargarConsultorios();
    this.consultorioService.getList().subscribe(data => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  cargarConsultorios() {
    this.consultorioService.listar().subscribe((data) => {
      this.originalDataSource = data;
      this.dataSource = [...this.originalDataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  addConsultorio() {
    this.router.navigate(['/consultorio/nuevo']);
  }

  editarConsultorio(id: number) {
    this.router.navigate(['/consultorio/ediciones', id]);
  }

  eliminarConsultorio(id: number) {
    if (confirm('¿Está seguro de eliminar este consultorio?')) {
      this.consultorioService.eliminar(id).subscribe({
        next: () => {
          alert('Consultorio eliminado');
          this.cargarConsultorios();
        },
        error: (err) => {
          alert('No se puede eliminar este consultorio. Puede que esté relacionado con otras tablas.');
        }
      });
    }
  }

  filter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource = this.originalDataSource.filter(consultorio => 
      consultorio.numero.toLowerCase().includes(filterValue) ||
      consultorio.sede.nombre.toLowerCase().includes(filterValue) ||
      consultorio.sede.direccion.toLowerCase().includes(filterValue)
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
    this.role=this.loginService.showRole();
    this.username=this.loginService.showUser();
    return this.loginService.verificar();
  }
  

}
