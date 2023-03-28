import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SourceListComponent } from './components/list/source.list.component';
import { SourceDetailsComponent } from './components/details/source.details.component';
import { SourceImportComponent } from './components/import/source.import.component';

const routes: Routes = [
    { path: '', component: SourceListComponent },
    { path: 'details/:id', component: SourceDetailsComponent },
    { path: 'details', component: SourceDetailsComponent },
    { path: 'import', component: SourceImportComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class SourcesRoutingModule {}
