import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/service/security/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtRequest } from 'src/app/model/security/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  username: string = "";
  password: string = "";
  mensaje: string = "";

  ngOnInit(): void { }

  login() {
    let request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;
    const helper = new JwtHelperService();

    this.loginService.login(request).subscribe((data: any) => {
      sessionStorage.setItem("token", data.jwttoken);
      const decodedToken = helper.decodeToken(data.jwttoken);
      const username = decodedToken?.sub;
      const roles = decodedToken?.role || [];

      console.log('Usuario:', username);
      console.log('Rol:', roles);

      if (roles.includes('ADMIN')) {
        this.router.navigate(['/components/doctor']);
      } else {
        this.router.navigate(['/home']);
      }
    }, error => {
      this.mensaje = "Credenciales incorrectas!!!";
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    });
  }
}
