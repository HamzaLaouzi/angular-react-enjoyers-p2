import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayerService } from '../players.services';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.html',
  styleUrls: ['./add-player.css'],
  imports: [ReactiveFormsModule]
})
export class AddPlayerComponent {
  @Output() cerrar = new EventEmitter<void>();
  playerForm: FormGroup;

  constructor(private fb: FormBuilder, private playerService: PlayerService) {
    this.playerForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      posicion: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      altura: ['', [Validators.required, Validators.min(1)]],
      multimedia0: [''],
      youtubeId: [''],
      info: ['']
    });
  }

  onSubmit() {
    if (this.playerForm.valid) {
      const playerData = {
        id: this.playerForm.value.id,
        nombre: this.playerForm.value.nombre,
        apellidos: this.playerForm.value.apellidos,
        posicion: this.playerForm.value.posicion,
        edad: this.playerForm.value.edad,
        altura: this.playerForm.value.altura,
        multimedia: [this.playerForm.value.multimedia0],
        youtubeId: this.playerForm.value.youtubeId,
        info: this.playerForm.value.info
      };

      this.playerService.addPlayer(playerData)
        .then(() => {
          alert('✅ Jugador añadido correctamente');
          this.cerrar.emit(); // Cierra el popup
        })
        .catch(err => console.error('❌ Error al añadir jugador:', err));
    } else {
      alert('Por favor completa los campos obligatorios');
    }
  }
}