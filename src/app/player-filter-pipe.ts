import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../app/models/player.model';

@Pipe({
  name: 'playerFilter',
  standalone: true
})
export class PlayerFilterPipe implements PipeTransform {
  transform<T extends Player>(
    players: (T & { id?: string })[] | null | undefined,
    name: string = '',
    minHeight: number | null = null,
    position: string = ''
  ): (T & { id?: string })[] {
    if (!players) return [];

    return players.filter(player => {
      const matchesName = name
        ? player.nombre.toLowerCase().includes(name.toLowerCase()) ||
        player.apellidos.toLowerCase().includes(name.toLowerCase())
        : true;

      const matchesHeight = minHeight
        ? player.altura >= minHeight
        : true;

      const matchesPosition = position
        ? player.posicion.toLowerCase() === position.toLowerCase()
        : true;

      return matchesName && matchesHeight && matchesPosition;
    });
  }
}
