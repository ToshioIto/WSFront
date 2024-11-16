import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, throwError } from 'rxjs';
import { Consultorio } from '../model/consultorio';
import { catchError } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ConsultorioService {
  private url = `${base_url}/consultorios`;
  private listaCambio = new Subject<Consultorio[]>();

  constructor(private http: HttpClient) {}

  listar() {
    const token = sessionStorage.getItem('token');
    return this.http.get<Consultorio[]>(this.url, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  registrar(consultorio: Consultorio) {
    const token = sessionStorage.getItem('token');
    return this.http.post(this.url, consultorio, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  actualizar(consultorio: Consultorio) {
    const token = sessionStorage.getItem('token');
    return this.http.put(this.url, consultorio, {
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

  setList(listaNueva: Consultorio[]) {
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
