import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../interfaces/persona.interface';

@Injectable({
  providedIn: 'root'
})

export class PersonasService {

  public urlBase: string = 'http://localhost:3000';
  
  constructor( private _http: HttpClient ) { }

  obtenerListadoPersonas(): Observable<Persona[]> {
    return this._http.get<Persona[]>(`${this.urlBase}/usuarios`);
  }

  listarPorPersona( id: number ): Observable<Persona> {
    return this._http.get<Persona>(`${this.urlBase}/usuarios/${id}`);
  }

  editarPersona(datosPersona: number, id: number): Observable<Persona> {
    return this._http.put<Persona>(`${this.urlBase}/usuarios/${id}`, datosPersona);
  }

  eliminarPersona( idPersona: number ) {
    return this._http.delete(`${this.urlBase}/usuarios/${idPersona}`)
  }

  agregarPersona( persona: Persona ): Observable<Persona> {
    return this._http.post<Persona>(`${this.urlBase}/usuarios/`, persona);
  }

}
