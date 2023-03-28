import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { UnauthorizedRoutingModule } from './unauthorized-routing.module';

import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
    imports: [
        SharedModule,
        UnauthorizedRoutingModule,
    ],
    declarations: [
        UnauthorizedComponent,
    ],
})
export class Module {}
