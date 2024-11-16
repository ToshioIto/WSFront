import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Registro } from 'src/app/model/security/registro';
import { RegistroService } from 'src/app/service/security/registro.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  passwordVisible: boolean = false;
  roles: string[] = ['ADMIN', 'USER'];
  registro: Registro = new Registro();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private registroService: RegistroService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Solo números
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: ['', Validators.required]
    });
  }

  registrar() {
    if (this.form.valid) {
      const registro: Registro = {
        id: 0,
        username: this.form.value.username,
        password: this.form.value.password,
        enabled: true,
        name: this.form.value.name,
        lastName: this.form.value.lastName,
        dni: this.form.value.dni,
        birthDate: new Date(this.form.value.birthDate),
        email: this.form.value.email,
        roles: [this.form.value.roles]
      };

      this.registroService.insert(registro).subscribe(
        (data) => {
          this.router.navigate(['/login']);
          this.openDialog('Registro Exitoso', 'El usuario se ha registrado correctamente.');
        },
        (error) => {
          this.openDialog('Error', 'Hubo un problema en el registro.');
        }
      );
    } else {
      this.openDialog('Formulario no válido', 'Por favor, completa todos los campos.');
    }
  }

  openDialog(title: string, message: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title, message }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('El cuadro de diálogo se cerró');
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }  
  
}
