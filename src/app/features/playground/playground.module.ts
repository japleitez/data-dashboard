import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PlaygroundRoutingModule } from './playground-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { PlaygroundService } from './shared/service/playground.service';

// module components
import { PlayListComponent } from './components/list/play.list.component';
import { PlayDetailsComponent } from './components/details/play.details.component';
import { AlertErrorService } from '../../shared/alerts/alert-error.service';

@NgModule({
    imports: [
        SharedModule,
        PlaygroundRoutingModule,
        ReactiveFormsModule,
    ],
    declarations: [
        PlayListComponent,
        PlayDetailsComponent,
    ],
    providers: [
        PlaygroundService,
        AlertErrorService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class Module {
}
