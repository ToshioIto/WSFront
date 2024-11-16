import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'src/app/model/security/userdata';
import { LoginService } from 'src/app/service/security/login.service';

@Component({
  selector: 'app-ver-credencial',
  templateUrl: './ver-credencial.component.html',
  styleUrls: ['./ver-credencial.component.css']
})
export class VerCredencialComponent implements OnInit{
  userData: UserData | null = null;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.loginService.getUserDetails().subscribe(
      (data: UserData) => {
        this.userData = data;
      },
      error => {
        console.error("Error al cargar las credenciales del usuario:", error);
      }
    );
  }

  editarPerfil() {
    this.router.navigate(['/components/home/editar-perfil']);
  }
}
