import { Component } from '@angular/core'
import { CommonModule, CurrencyPipe } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms'
import { CartService } from '../../services/cart.service'
import { type Item } from '../../interfaces/item'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    CurrencyPipe,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './product-browse.component.html',
  styleUrl: './product-browse.component.scss'
})
export class ProductBrowseComponent {
  constructor(private readonly cartService: CartService) {}

  #filter = ''
  get filter(): string {
    return this.#filter
  }

  set filter(arg: string) {
    this.#filter = arg
    this.relevantProducts = this.products.filter((product) => product.name.toLowerCase().includes(arg.toLowerCase()))
  }

  category = 'shirts'
  products = [
    {
      id: 1,
      name: 'Be Curious Shirt',
      image: 'images/beCuriousShirt.png',
      price: 50
    },
    {
      id: 2,
      name: 'Creator Shirt',
      image: 'images/creatorShirt.png',
      price: 35
    },
    {
      id: 3,
      name: 'Doer Shirt',
      image: 'images/doerShirt.png',
      price: 35
    },
    {
      id: 4,
      name: 'Translator Shirt',
      image: 'images/translatorShirt.png',
      price: 35
    },
    {
      id: 5,
      name: 'Pro Shirt',
      image: 'images/proShirt.png',
      price: 60
    }
  ]

  relevantProducts = this.products

  onAddToCart(product: Item): void {
    this.cartService.addToCart(product)
  }
}
