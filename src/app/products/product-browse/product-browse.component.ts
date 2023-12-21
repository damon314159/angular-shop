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
  // Dependency injection in constructor
  constructor(private readonly cartService: CartService, private readonly productDataService: ProductDataService) {}

  // Keep track of all the items, the filtered items, and which are hovered over
  sub!: Subscription
  products!: CategorisedItem[]
  relevantProducts!: CategorisedItem[]
  errorMessage!: string
  hover: Record<string, boolean> = {}

  // Initialise a filtering string, with a getter...
  #filter = ''
  get filter(): string {
    return this.#filter
  }

  // And a setter that will update the relevant products on changes to the filter string
  set filter(arg: string) {
    this.#filter = arg
    this.relevantProducts = this.products.filter((product) => product.name.toLowerCase().includes(arg.toLowerCase()))
  }

  ngOnInit(): void {
    // When the component is initialised, subscribe to the product data service
    this.sub = this.productDataService.getProducts().subscribe({
      next: (products) => {
        // Any time a new products array is published, update the component
        this.products = products
        this.relevantProducts = this.products
        Array.from(this.products.values()).forEach((product: CategorisedItem) => {
          // Keep track of which elements are being hovered over, initially none
          this.hover[product.category + product.id] = false
        })
      },
      // Log any errors caused by the http request
      error: (err) => (this.errorMessage = err)
    })
  }

  // Make sure to unsubscribe from the data service when the component is destroyed
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  // Call the cart service method when an add to cart button is pressed
  onAddToCart(product: CategorisedItem): void {
    this.cartService.addToCart(product)
  }
}
