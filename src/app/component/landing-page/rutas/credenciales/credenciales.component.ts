import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credenciales',
  templateUrl: './credenciales.component.html',
  styleUrls: ['./credenciales.component.css']
})
export class CredencialesComponent {
  constructor(public route: ActivatedRoute) {}
  ngOnInit(): void {}
}
