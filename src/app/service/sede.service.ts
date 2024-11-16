import { Injectable } from '@angular/core';
import { Sede } from '../model/sede';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private url = `${base_url}/sedes`;
  private listaCambio = new Subject<Sede[]>();

  constructor(private http: HttpClient) {}

  listar(): Observable<Sede[]> {
    const token = sessionStorage.getItem('token');
    return this.http.get<Sede[]>(this.url, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  registrar(sede: Sede): Observable<any> {
    const token = sessionStorage.getItem('token');
    return this.http.post(this.url, sede, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  actualizar(sede: Sede): Observable<any> {
    const token = sessionStorage.getItem('token');
    return this.http.put(this.url, sede, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  eliminar(id: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    return this.http.delete(`${this.url}/${id}`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  setList(listaNueva: Sede[]) {
    this.listaCambio.next(listaNueva);
  }

  getList(): Observable<Sede[]> {
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
