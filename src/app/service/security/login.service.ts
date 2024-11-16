import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, tap, from } from 'rxjs';
import { JwtRequest } from 'src/app/model/security/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserData } from 'src/app/model/security/userdata';
import { Registro } from 'src/app/model/security/registro';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.base;
  private userSubject: BehaviorSubject<Registro> = new BehaviorSubject<Registro>(new Registro());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(request: JwtRequest) {
    return this.http.post(`${this.baseUrl}/authenticate`, request);
  }

  verificar() {
    let token = sessionStorage.getItem("token");
    return token != null;
  }

  showRole() {
    let token = sessionStorage.getItem("token");
    if (!token) {
      return null;
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.role;
  }

  showUser() {
    let token = sessionStorage.getItem("token");
    if (!token) {
      return null;
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.sub;
  }

  showName() {
    let token = sessionStorage.getItem("token");
    if (!token) {
      return null;
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.name;
  }

  getUserDetails(): Observable<UserData> {
    let token = sessionStorage.getItem("token");
    if (token) {
      return this.http.get<UserData>(`${this.baseUrl}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).pipe(tap(user => this.userSubject.next(user)));
    } else {
      return from(Promise.reject('No token found'));
    }
  }

  updateUserDetails(user: UserData) {
    const token = sessionStorage.getItem('token');
    return this.http.put(`${this.baseUrl}/users/update`, user, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
    });
  }

  deleteAccount(): Observable<any> {
    const token = sessionStorage.getItem('token');
    return this.http.delete(`${this.baseUrl}/users/delete`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }  

}
