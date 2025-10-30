import { Routes } from '@angular/router';
import { PlayersComponent } from './players/players';
import { DetailComponent } from './detail/detail';

export const routes: Routes = [
  { path: '', component: PlayersComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'detail/:id', component: DetailComponent },
];