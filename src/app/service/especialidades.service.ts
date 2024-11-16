import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, throwError } from 'rxjs';
import { Especialidad } from '../model/especialidades';
import { catchError } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  private url = `${base_url}/especialidades`;
  private listaCambio = new Subject<Especialidad[]>();

  constructor(private http: HttpClient) {}

  listar() {
    const token = sessionStorage.getItem('token');
    return this.http.get<Especialidad[]>(this.url, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  registrar(especialidad: Especialidad) {
    const token = sessionStorage.getItem('token');
    return this.http.post(this.url, especialidad, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  actualizar(especialidad: Especialidad) {
    const token = sessionStorage.getItem('token');
    return this.http.put(this.url, especialidad, {
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

  setList(listaNueva: Especialidad[]) {
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
