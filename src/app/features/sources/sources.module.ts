import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SourcesRoutingModule } from './sources-routing.module';

import { SharedModule } from '../../shared/shared.module';

import { SourceService } from './shared/services/source.service';

// module components
import { SourceListComponent } from './components/list/source.list.component';
import { SourceDetailsComponent } from './components/details/source.details.component';
import { SourceImportComponent } from './components/import/source.import.component';
import { AlertErrorService } from '../../shared/alerts/alert-error.service';

@NgModule({
    imports: [
        SharedModule,
        SourcesRoutingModule,
    ],
    declarations: [
        SourceListComponent,
        SourceDetailsComponent,
        SourceImportComponent,
    ],
    providers: [
        SourceService,
        AlertErrorService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class Module {
}
