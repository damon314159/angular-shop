import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet, Router } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from '@angular/material/menu'
import { MatBadgeModule } from '@angular/material/badge'
import { CartService } from './services/cart.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private readonly router: Router, private readonly cartService: CartService) {}

  getTotalQuantity(): number {
    return this.cartService.getTotalQuantity()
  }

  async onHomeNav(): Promise<void> {
    await this.router.navigate(['/welcome'])
  }

  async onShopNav(): Promise<void> {
    await this.router.navigate(['/catalogue'])
  }

  async onCartNav(): Promise<void> {
    await this.router.navigate(['/shopping-cart'])
  }
}
