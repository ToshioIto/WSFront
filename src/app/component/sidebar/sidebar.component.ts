import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isVisible: boolean = true;
  @Output() sidebarToggled = new EventEmitter<boolean>();
  isCollapsed: boolean = false;

  constructor(private eRef: ElementRef, private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggled.emit(this.isCollapsed);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (!this.isCollapsed) {
        this.isCollapsed = true;
        this.sidebarToggled.emit(this.isCollapsed);
      }
    } else if (this.isCollapsed) {
      this.toggleSidebar();
    }
  }

  cerrar() {
    const confirmarCerrar = confirm('¿Estás seguro de cerrar la sesión?');
    
    if (confirmarCerrar) {
      sessionStorage.clear();
      this.router.navigate(['/login']);
      alert('Sesión cerrada exitosamente');
    }
  }  
}
