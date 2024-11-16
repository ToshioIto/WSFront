import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/security/login/login.component';
import { RegistroComponent } from './component/security/registro/registro.component';
import { GuardService } from './service/security/guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'components',
    loadChildren: () => import('./component/component.module').then((m) => m.ComponentModule),
    canActivate: [GuardService]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
