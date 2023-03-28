import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CrawlersRoutingModule } from './crawlers-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CrawlerService } from './shared';

// module components
import { CrawlerListComponent } from './components/list/crawler.list.component';
import { CrawlerDetailsComponent } from './components/details/crawler.details.component';
import { AlertErrorService } from '../../shared/alerts/alert-error.service';
import { SourceService } from '../sources/shared';
import { CrawlerCopyComponent } from './components/copy/crawler.copy.component';
import { CrawlerImportComponent } from './components/import/crawler.import.component';
import { DetailsSourcesComponent } from './components/detailssources/details.sources.component';
import { CrawlersHelpComponent } from './components/help/crawlers.help.component';
import { PlaygroundService } from '../playground/shared/service/playground.service';

@NgModule({
    imports: [
        SharedModule,
        CrawlersRoutingModule,
    ],
    declarations: [
        CrawlerListComponent,
        CrawlerDetailsComponent,
        DetailsSourcesComponent,
        CrawlerCopyComponent,
        CrawlerImportComponent,
        CrawlersHelpComponent,
    ],
    providers: [
        CrawlerService,
        SourceService,
        AlertErrorService,
        PlaygroundService,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class Module {
}
