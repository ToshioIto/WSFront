import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, throwError } from 'rxjs';
import { Doctor } from '../model/doctor';
import { catchError } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private url = `${base_url}/doctores`;
  private listaCambio = new Subject<Doctor[]>();

  constructor(private http: HttpClient) {}

  listar() {
    const token = sessionStorage.getItem('token');
    return this.http.get<Doctor[]>(this.url, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  registrar(doctor: Doctor) {
    const token = sessionStorage.getItem('token');
    return this.http.post(this.url, doctor, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  actualizar(doctor: Doctor) {
    const token = sessionStorage.getItem('token');
    return this.http.put(this.url, doctor, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  eliminar(id: number) {
    const token = sessionStorage.getItem('token');
    return this.http.delete(`${this.url}/${id}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  setList(listaNueva: Doctor[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 409 || error.status === 500) {
        errorMessage = 'No se puede borrar: está vinculado a otros registros.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }
}
