import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Registro } from './model/security/registro';
import { LoginService } from './service/security/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'worksolution';
  showSidebar: boolean = true;
  isSidebarCollapsed: boolean = false;
  user: Registro = new Registro();
  error: string = "";
  role: string = "";
  username: string = "";

  private hiddenRoutes = [
    '/home',
    '/login',
    '/registro',
    '/components/home/ver-perfil',
    '/components/home/editar-perfil',
    '/home/preguntas',
    '/home/citas',
    '/home/historial',
    '/doctor/nuevo',
    '/doctor/ediciones',
    '/sedes/nuevo',
    '/sedes/ediciones',
    '/especialidades/nuevo',
    '/especialidades/ediciones',
    '/consultorio/nuevo',
    '/consultorio/ediciones',
    '/horarios/nuevo',
    '/horarios/ediciones',
    '/precios-cita/nuevo',
    '/precios-cita/ediciones',          
  ];

  constructor(private router: Router, private loginService: LoginService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkSidebarVisibility(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    this.checkSidebarVisibility(this.router.url);
  }

  private checkSidebarVisibility(url: string) {
    this.showSidebar = !this.hiddenRoutes.some(route => url.startsWith(route));
    this.isSidebarCollapsed = !this.showSidebar;
  }

  onSidebarToggled(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }

  get contentClass() {
    if (!this.showSidebar) {
      return 'full-width';
    }
    return this.isSidebarCollapsed ? 'expanded' : '';
  }


  verificar() {
    this.role = this.loginService.showRole();
    this.username = this.loginService.showUser();
    return this.loginService.verificar();
  }

  validarRol() {
    return this.role === 'ADMIN' || this.role === 'USER';
  }

  cerrar() {
    const confirmarCerrar = confirm('¿Estás seguro de cerrar la sesión?');
    
    if (confirmarCerrar) {
      sessionStorage.clear();
      this.router.navigate(['/login']);
      alert('Sesión cerrada exitosamente');
    }
  }  

  getUserDetails() {
    this.loginService.getUserDetails().subscribe(
      data => {
        this.user = data;
      },
      error => {
        this.error = error;
        console.error('Error al obtener los detalles del usuario', error);
      }
    );
  }
}
