import { type Routes } from '@angular/router'
import { WelcomeComponent } from './home/welcome.component'
import { ProductBrowseComponent } from './products/product-browse/product-browse.component'

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'catalogue', component: ProductBrowseComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
]
