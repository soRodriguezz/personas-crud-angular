import { PersonasService } from './../services/personas.service';
import { Component, OnInit } from '@angular/core';
import { Persona } from '../interfaces/persona.interface';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-personas',
  templateUrl: './formulario-personas.component.html',
  styleUrls: ['./formulario-personas.component.css'],
})
export class FormularioPersonasComponent implements OnInit {
  public listadoPersonas: Persona[] = [];
  public subs: Subscription[] = [];
  public tituloModal: string = '';
  public nombreBoton: string = '';
  public idPersona: number = 0;

  public isEditarCrear: boolean = true;

  public formularioPersona: FormGroup = this._fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required]]
  });


  constructor(private personasService: PersonasService, private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.listarPersonas();
  }

  public async listarPersonas() {
    this.personasService.obtenerListadoPersonas().subscribe(
      (resp) => (this.listadoPersonas = resp),
      (error) => console.log(error)
    );
  }

  public async listarPersonaPorID(id: number) {
    this.personasService.listarPorPersona(id).subscribe(
      (resp) => console.log(resp),
      (error) => console.log(error)
    );
  }

  public async eliminarPersona(idPersona: number) {
    Swal.fire({
      title: '¡Cuidado!',
      text: "¿Está seguro que desea eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.subs.push(
          this.personasService.eliminarPersona(idPersona).subscribe((_) => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: 'success',
              title: 'Registro eliminar correctamente',
            });

            this.listarPersonas();
          })
        );
      }
    });
  }

  public async crearPersona() {
    this.subs.push(
      this.personasService.agregarPersona(this.formularioPersona.value).subscribe(
        (_) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'success',
            title: 'Registro creado correctamente',
          });
          this.listarPersonas();

          var obj = document.getElementById('cerrarModal');
          obj!.click();
          this.formularioPersona.reset();

        }
      )
    );
  }

  public async editarPersona(){
    this.subs.push(
      this.personasService.editarPersona( this.formularioPersona.value, this.idPersona ).subscribe( (_) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          title: '¡Actualizado con exito!'
        })

        this.listarPersonas();

        var obj = document.getElementById('cerrarModal');
        obj!.click();
        this.formularioPersona.reset();

      })
    );
  }

  editar( id: number ) {
    this.tituloModal = 'Editar Registro';
    this.nombreBoton = 'Editar';

    this.isEditarCrear = false;
    this.idPersona = id;
    this.subs.push(
      this.personasService.listarPorPersona( id ).subscribe( (persona) => {
        console.log(persona.username);

        

        this.formularioPersona.controls.username.setValue(persona.username);
        this.formularioPersona.controls.email.setValue(persona.email);
      })
      
    )
    
  }

  crear() {
    this.tituloModal = 'Crear Registro';
    this.nombreBoton = 'Guardar';

    this.isEditarCrear = true; 

  }

  ngOnDestroy(): void {
    this.subs.forEach((subscripcion) => subscripcion.unsubscribe());
  }


}
