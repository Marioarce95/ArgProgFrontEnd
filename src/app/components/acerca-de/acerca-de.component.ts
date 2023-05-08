import { Component, OnInit } from '@angular/core';
import { persona } from 'src/app/model/persona.model';
import { PersonaService } from 'src/app/service/persona.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css'],
  providers: [PersonaService]
})
export class AcercaDeComponent implements OnInit {
  persona: persona;
  id: number;
  editando: boolean = false;
  mensaje: string;
  isLogged = false;

  constructor(private personaService: PersonaService, private tokenService: TokenService) { }

  ngOnInit(): void {
    this.id = 1; // Reemplaza con el ID de la persona que deseas obtener
    this.obtenerPersona();
    this.checkLoginStatus();
    this.editando = false; 
  }

  obtenerPersona(): void {
    this.personaService.getPersona(this.id).subscribe(
      data => {
        this.persona = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  toggleEdicion(): void {
    if (this.isLogged) {
      this.editando = !this.editando;
    }
  }  

  guardarPersona(): void {
    this.personaService.actualizarPersona(this.id, this.persona).subscribe(
      data => {
        console.log(data);
        this.mensaje = 'La persona ha sido actualizada correctamente.';
        this.editando = false;
      },
      error => {
        console.log(error);
        this.mensaje = 'Ha ocurrido un error al intentar actualizar la persona.';
      }
    );
  }

  eliminarPersona(): void {
    this.personaService.eliminarPersona(this.id).subscribe(
      data => {
        console.log(data);
        this.mensaje = 'La persona ha sido eliminada correctamente.';
        this.editando = false;
      },
      error => {
        console.log(error);
        this.mensaje = 'Ha ocurrido un error al intentar eliminar la persona.';
      }
    );
  }

  cancelarEdicion(): void {
    this.editando = false;
  }

  checkLoginStatus(): void {
    this.isLogged = this.tokenService.getToken() !== null;
  }

  logout(): void {
    this.tokenService.logOut();
    this.checkLoginStatus();
    this.editando = false; // Asegurarse de que el modo de edición esté desactivado al hacer logout
  }
}
