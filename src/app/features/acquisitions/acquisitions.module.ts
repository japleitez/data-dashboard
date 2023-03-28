import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AcquisitionRoutingModule } from './acquisition-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AcquisitionService } from './shared/services/acquisition.service';

// module components
import { AcqListComponent } from './components/list/acq.list.component';
import { AcqDetailsComponent } from './components/details/acq.details.component';
import { AlertErrorService } from '../../shared/alerts/alert-error.service';

@NgModule({
    imports: [
        SharedModule,
        AcquisitionRoutingModule,
        FontAwesomeModule
    ],
    declarations: [
        AcqListComponent,
        AcqDetailsComponent,
    ],
    providers: [
        AcquisitionService,
        AlertErrorService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class Module {
}
