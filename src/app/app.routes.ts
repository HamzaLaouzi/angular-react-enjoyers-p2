import { Routes } from '@angular/router';
import { PlayersComponent } from './components/players/players';
import { DetailComponent } from './components/detail/detail';

export const routes: Routes = [
  { path: '', component: PlayersComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'detail/:id', component: DetailComponent },
];