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
import { ProductDataService } from '../../services/product-data.service'
import { type CategorisedItem } from '../../interfaces/categorised-item'
import { type Subscription } from 'rxjs'
import { ProductDetailsComponent } from '../product-details/product-details.component'

@Component({
  standalone: true,
  templateUrl: './product-browse.component.html',
  styleUrl: './product-browse.component.scss',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    CurrencyPipe,
    MatIconModule,
    FormsModule,
    ProductDetailsComponent
  ]
})
export class ProductBrowseComponent {
  constructor(private readonly cartService: CartService, private readonly productDataService: ProductDataService) {}

  sub!: Subscription
  products!: CategorisedItem[]
  relevantProducts!: CategorisedItem[]
  errorMessage!: string
  hover: Record<string, boolean> = {}

  #filter = ''
  get filter(): string {
    return this.#filter
  }

  set filter(arg: string) {
    this.#filter = arg
    this.relevantProducts = this.products.filter((product) => product.name.toLowerCase().includes(arg.toLowerCase()))
  }

  ngOnInit(): void {
    this.sub = this.productDataService.getProducts().subscribe({
      next: (products) => {
        this.products = products
        this.relevantProducts = this.products
        Array.from(this.products.values()).forEach((product: CategorisedItem) => {
          this.hover[product.category + product.id] = false
        })
      },
      error: (err) => (this.errorMessage = err)
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  onAddToCart(product: CategorisedItem): void {
    this.cartService.addToCart(product)
  }
}
