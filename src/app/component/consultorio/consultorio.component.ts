import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-consultorio',
  templateUrl: './consultorio.component.html',
  styleUrls: ['./consultorio.component.css']
})
export class ConsultorioComponent {
  constructor(public route: ActivatedRoute) {}
  ngOnInit(): void {}
}
