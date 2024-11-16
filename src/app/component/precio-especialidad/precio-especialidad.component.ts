import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-precio-especialidad',
  templateUrl: './precio-especialidad.component.html',
  styleUrls: ['./precio-especialidad.component.css']
})
export class PrecioEspecialidadComponent {
  constructor(public route: ActivatedRoute) {}
  ngOnInit(): void {}
}
