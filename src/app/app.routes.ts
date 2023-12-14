import { type Routes } from '@angular/router'
import { WelcomeComponent } from './home/welcome.component'
import { ProductBrowseComponent } from './products/product-browse/product-browse.component'
import { CheckoutComponent } from './checkout/checkout.component'

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'catalogue', component: ProductBrowseComponent },
  { path: 'shopping-cart', component: CheckoutComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
]
