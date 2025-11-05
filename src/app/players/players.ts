// src/app/players/players.ts

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Player } from '../models/player.model';
import { PlayerService } from '../services/player.service'; 
import { DetailComponent } from '../detail/detail';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerFilterPipe } from '../player-filter-pipe';

@Component({
  selector: 'app-players',
  standalone: true,
  templateUrl: './players.html',
  styleUrls: ['./players.css'],
  imports: [CommonModule, FormsModule, PlayerFilterPipe] 
})
export class PlayersComponent implements OnInit { 
  
  players: Player[] = [];
  // 🔑 Tipo correcto según TU modelo
  selectedPlayerId: number | null = null; 

  // Variables para filtros (NO duplicadas)
  filterName: string = '';
  filterHeight: number | null = null;
  filterPosition: string = '';
  showList = true;

  constructor(private dialog: MatDialog, private playerService: PlayerService) {}

  ngOnInit() {
    this.loadPlayers();
  }

  // Carga inicial y recarga de datos
  loadPlayers() {
     this.playerService.getPlayers().subscribe(data => {
       this.players = data;
     });
  }

  // 🔑 NUEVO MÉTODO: Añadir Jugador (Modo Creación)
  addPlayer(): void {
      // 🔑 ADAPTACIÓN FORZADA AL MODELO: Multimedia es array, Altura es number
      const newPlayer: Omit<Player, 'id'> = {
          nombre: 'Nuevo',
          apellidos: 'Jugador',
          posicion: 'Base',
          edad: 20, 
          altura: 190, // Valor por defecto como number (cm)
          multimedia: ['https://ejemplo.com/defecto.jpg'], // Debe ser un array de strings
          youtubeId: '',
          info: 'Información del nuevo jugador.'
      };

      this.dialog.open(DetailComponent, {
          data: newPlayer, 
          width: '700px',
      })
      .afterClosed().subscribe(result => {
          if (result && result.updated) { 
              this.loadPlayers(); 
              alert('✅ Jugador agregado correctamente.');
          }
      });
  }

  // openDialog: Maneja Ver, Editar y Eliminar
  openDialog(player: Player) {
    // 🔑 Mantenemos el tipo number según TU modelo
    this.selectedPlayerId = player.id ? player.id : null; 
    
    this.dialog.open(DetailComponent, {
      width: '700px',
      data: player 
    })
    .afterClosed().subscribe(result => {
      this.selectedPlayerId = null;
      
      // Lógica para recargar la lista si hubo una modificación o eliminación
      if (result && (result.updated || result.deleted)) {
          this.loadPlayers();
      }
    });
  }
}