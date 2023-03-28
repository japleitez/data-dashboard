import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrawlerListComponent } from './components/list/crawler.list.component';
import { CrawlerDetailsComponent } from './components/details/crawler.details.component';
import { CrawlerCopyComponent } from './components/copy/crawler.copy.component';
import { CrawlerImportComponent } from './components/import/crawler.import.component';
import { DetailsSourcesComponent } from './components/detailssources/details.sources.component';

const routes: Routes = [
    { path: '', component: CrawlerListComponent },
    { path: 'details/:id', component: CrawlerDetailsComponent },
    { path: 'details/:id/sources', component: DetailsSourcesComponent },
    { path: 'details', component: CrawlerDetailsComponent },
    { path: 'copy/:id', component: CrawlerCopyComponent },
    { path: 'import', component: CrawlerImportComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
})
export class CrawlersRoutingModule {}
