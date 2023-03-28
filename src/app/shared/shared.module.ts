import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { UxAllModule } from '@eui/components/legacy';
import { EuiAllModule } from '@eui/components';
import { CommonModule } from '@angular/common';
import { FiltersFormComponent } from './components/filters-form/filters-form.component';
import { FiltersFormElementComponent } from './components/filters-form-element/filters-form-element.component';
import { MetadataFormComponent } from './components/metadata-form/metadata-form.component';

@NgModule({
    imports: [
        UxAllModule,
        EuiAllModule,
        TranslateModule,
        CommonModule,
    ],
    declarations: [
        FiltersFormComponent,
        FiltersFormElementComponent,
        MetadataFormComponent,
    ],
    exports: [
        UxAllModule,
        EuiAllModule,
        TranslateModule,
        FiltersFormComponent,
        FiltersFormElementComponent,
        MetadataFormComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class SharedModule {}
