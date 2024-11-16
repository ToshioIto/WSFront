import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/security/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  role:string="";
  username:string=""
  menuOpen = false;
  moreOptionsOpen = false;

  constructor(private loginService: LoginService, private dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void { 
    this.verificar();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleMoreOptions() {
    this.moreOptionsOpen = !this.moreOptionsOpen;
  }
  
  verificar() {
    this.role=this.loginService.showRole();
    this.username=this.loginService.showUser();
    return this.loginService.verificar();
  }

  cerrar() {
    const confirmarCerrar = confirm('¿Estás seguro de cerrar la sesión?');
    
    if (confirmarCerrar) {
      sessionStorage.clear();
      this.router.navigate(['/login']);
      alert('Sesión cerrada exitosamente');
    }
  }  
}
