import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/service/security/login.service';
import { UserData } from 'src/app/model/security/userdata';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-credencial',
  templateUrl: './editar-credencial.component.html',
  styleUrls: ['./editar-credencial.component.css']
})
export class EditarCredencialComponent implements OnInit {
  userData: UserData = new UserData();

  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.loginService.getUserDetails().subscribe(
      (data: UserData) => {
        this.userData = data;
        this.userData.password = '';
      },
      error => {
        console.error('Error al cargar las credenciales del usuario:', error);
      }
    );
  }

  updateCredentials() {
    this.loginService.updateUserDetails(this.userData).subscribe(
      () => {
        this.snackBar.open('Credenciales actualizadas con éxito', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/components/ver-perfil']);
      },
      error => {
        console.error('Error al actualizar las credenciales:', error);
        this.snackBar.open('Error al actualizar las credenciales', 'Cerrar', { duration: 2000 });
      }
    );
  }

  deleteAccount() {
    if (confirm('Advertencia 1: ¿Estás absolutamente seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      if (confirm('Advertencia 2: Esta es una acción irreversible. ¿Realmente quieres continuar?')) {
        if (confirm('Advertencia 3: Última confirmación. Si eliminas tu cuenta, todos tus datos se perderán permanentemente. ¿Deseas proceder?')) {
          this.loginService.deleteAccount().subscribe(
            () => {
              sessionStorage.clear();
              this.snackBar.open('Cuenta eliminada exitosamente', 'Cerrar', { duration: 2000 });
              this.router.navigate(['/login']);
            },
            error => {
              console.error('Error al eliminar la cuenta:', error);
              this.snackBar.open('Error al eliminar la cuenta', 'Cerrar', { duration: 2000 });
            }
          );
        }
      }
    }
  }

  cancelar() {
    this.router.navigate(['/components/home/ver-perfil']);
  }
}
