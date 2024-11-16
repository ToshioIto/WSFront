import { Component, OnInit } from '@angular/core';
import { HorarioService } from 'src/app/service/horario.service';
import { Router } from '@angular/router';
import { Horario } from 'src/app/model/horario';
import { LoginService } from 'src/app/service/security/login.service';

@Component({
  selector: 'app-listar-horarios',
  templateUrl: './listar-horarios.component.html',
  styleUrls: ['./listar-horarios.component.css']
})
export class ListarHorariosComponent implements OnInit {
  dataSource: Horario[] = [];
  originalDataSource: Horario[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  paginatedData: Horario[] = [];
   role:string="";
  username:string="";

  constructor(private horarioService: HorarioService, private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this,this.verificar();
    this.cargarHorarios();
    this.horarioService.getList().subscribe(data => {
      this.dataSource = data.map(item => ({
        ...item,
        horaInicio: item.horaInicio ? new Date(`1970-01-01T${item.horaInicio}`) : new Date('1970-01-01T00:00:00'),
        horaFin: item.horaFin ? new Date(`1970-01-01T${item.horaFin}`) : new Date('1970-01-01T00:00:00')
      }));
      this.originalDataSource = [...this.dataSource];
      this.totalItems = data.length;
      this.paginarDatos();
    });
  }

  verificar() {
    this.role=this.loginService.showRole();
    this.username=this.loginService.showUser();
    return this.loginService.verificar();
  }

  cargarHorarios() {
    this.horarioService.listar().subscribe(data => {
      this.dataSource = data.map(item => ({
        ...item,
        horaInicio: item.horaInicio ? new Date(`1970-01-01T${item.horaInicio}`) : new Date('1970-01-01T00:00:00'),
        horaFin: item.horaFin ? new Date(`1970-01-01T${item.horaFin}`) : new Date('1970-01-01T00:00:00')
      }));
      this.originalDataSource = [...this.dataSource];
      this.totalItems = this.dataSource.length;
      this.paginarDatos();
    });
  }

  filter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource = this.originalDataSource.filter(horario => 
      horario.turno.toLowerCase().includes(filterValue) ||
      horario.doctor.nombre.toLowerCase().includes(filterValue)
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

  addHorario() {
    this.router.navigate(['/horarios/nuevo']).then(() => {
      this.cargarHorarios();
    });
  }

  editarHorario(id: number) {
    this.router.navigate(['/horarios/ediciones', id]).then(() => {
      this.cargarHorarios();
    });
  }

  eliminarHorario(id: number) {
    if (confirm('¿Está seguro de eliminar este horario?')) {
      this.horarioService.eliminar(id).subscribe(() => {
        this.cargarHorarios();
      });
    }
  }
}
