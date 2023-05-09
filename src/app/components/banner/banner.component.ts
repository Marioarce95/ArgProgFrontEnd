import { Component, OnInit } from '@angular/core';
import { persona } from 'src/app/model/persona.model';
import { PersonaService } from 'src/app/service/persona.service';
import { ImageService } from 'src/app/service/image.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  providers: [ImageService]
})
export class BannerComponent implements OnInit {
  persona: persona;
  id: number;
  editando: boolean = false;
  mensaje: string;
  isLogged = false;

  constructor(
    private personaService: PersonaService,
    private imageService: ImageService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.id = 1; // Reemplaza con el ID de la persona que deseas obtener
    this.obtenerPersona();
    this.editando = false;
    this.checkLoginStatus();
  }

  toggleEdicion(): void {
    if (this.isLogged) {
      this.editando = !this.editando;
    }
  }

  obtenerPersona(): void {
    const idPersona = 1; // Reemplaza con el ID de la persona que deseas obtener
    this.personaService.getPersona(idPersona).subscribe(
      (persona) => {
        this.persona = persona;
      },
      error => {
        console.log(error);
      }
    );
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

  uploadImage(event: any): void {
    const file = event.target.files[0];
    const name = 'perfil-image'; // Nombre de archivo personalizado o puedes generar uno único
    this.imageService.uploadImage(file, name).subscribe(
      percentage => {
        console.log(`Uploaded: ${percentage}%`);
      },
      error => {
        console.log(error);
      },
      () => {
        this.imageService.getImageUrl(name).subscribe(
          url => {
            this.persona.img = url;
            // Actualizar la imagen de perfil en la base de datos
            this.guardarPersona();
          },
          error => {
            console.log(error);
          }
        );
      }
    );
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

