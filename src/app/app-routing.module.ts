import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
    { path: '', redirectTo: 'screen/home', pathMatch: 'full' },
    { path: 'index.jsp', redirectTo: 'screen/home' },
    { path: 'screen/home', loadChildren: () => import('./features/home/home.module').then(m => m.Module) },
    { path: 'screen/unauthorized', loadChildren: () => import('./features/unauthorized/unauthorized.module').then(m => m.Module) },
    { path: 'screen/sources', loadChildren: () => import('./features/sources/sources.module').then(m => m.Module), canActivate: [AuthGuard] },
    { path: 'screen/crawlers', loadChildren: () => import('./features/crawlers/crawlers.module').then(m => m.Module), canActivate: [AuthGuard] },
    { path: 'screen/acquisitions', loadChildren: () => import('./features/acquisitions/acquisitions.module').then(m => m.Module), canActivate: [AuthGuard] },
    { path: 'screen/playground', loadChildren: () => import('./features/playground/playground.module').then(m => m.Module), canActivate: [AuthGuard] },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
})
export class AppRoutingModule {}
