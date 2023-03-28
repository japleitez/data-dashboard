import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcqListComponent } from './components/list/acq.list.component';
import { AcqDetailsComponent } from './components/details/acq.details.component';

const routes: Routes = [
    { path: '', component: AcqListComponent },
    { path: 'details/:id', component: AcqDetailsComponent },
    { path: 'details', component: AcqDetailsComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class AcquisitionRoutingModule {}
