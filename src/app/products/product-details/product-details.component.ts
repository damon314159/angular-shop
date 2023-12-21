import { Component, Input } from '@angular/core'
import { CurrencyPipe } from '@angular/common'
import { type Item } from '../../interfaces/item'

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  // The detailed view of the product takes an input of the product it will display
  @Input() product!: Item
}
