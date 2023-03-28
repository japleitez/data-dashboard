import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayListComponent } from './components/list/play.list.component';
import { PlayDetailsComponent } from './components/details/play.details.component';

const routes: Routes = [
    { path: '', component: PlayListComponent },
    { path: 'details/:type/:id', component: PlayDetailsComponent },
    { path: 'details', component: PlayDetailsComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class PlaygroundRoutingModule {}
