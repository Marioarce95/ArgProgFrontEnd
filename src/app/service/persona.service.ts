import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { persona } from '../model/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  URL = environment.URL + 'api/personas/';

  constructor(private http: HttpClient) { }

  public getPersona(id: number): Observable<persona> {
    return this.http.get<persona>(`${this.URL}traer/perfil/${id}`);
  }

  public actualizarPersona(id: number, persona: persona): Observable<any> {
    return this.http.put(`${this.URL}update/${id}`, persona);
  }

  public eliminarPersona(id: number): Observable<any> {
    return this.http.delete(`${this.URL}borrar/${id}`);
  }
}
