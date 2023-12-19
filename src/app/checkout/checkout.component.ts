import { Component, ViewChild } from '@angular/core'
import { CurrencyPipe } from '@angular/common'
import { MatTableModule, MatTable } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { CartService } from '../services/cart.service'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Router } from '@angular/router'
import { type Transaction } from '../interfaces/transaction'
import { MatDialog } from '@angular/material/dialog'
import { CheckoutFormComponent } from './checkout-form/checkout-form.component'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    CurrencyPipe,
    MatCardModule,
    MatExpansionModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  constructor(
    private readonly cartService: CartService,
    private readonly router: Router,
    public dialogue: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  displayedColumns: string[] = ['item', 'quantity', 'price']
  @ViewChild(MatTable) table!: MatTable<any>

  transactions: Transaction[] = []

  ngOnInit(): void {
    this.transactions = this.cartService.getCartItems()
    this.cartService.tableRefresh.subscribe(() => {
      this.table.renderRows()
    })
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice()
  }

  getTotalQuantity(): number {
    return this.cartService.getTotalQuantity()
  }

  getTax(): number {
    return this.cartService.getTax()
  }

  getShipping(): number {
    return this.cartService.getShipping()
  }

  getTotal(): number {
    return this.cartService.getTotal()
  }

  plusQuantity(transaction: Transaction): void {
    const item = this.transactions.find((t) => t === transaction)!
    this.cartService.addToCart(item)
    this.transactions = this.cartService.getCartItems()
    this.table.renderRows()
  }

  minusQuantity(transaction: Transaction): void {
    const item = this.transactions.find((t) => t === transaction)!
    this.cartService.removeFromCart(item)
    this.transactions = this.cartService.getCartItems()
    this.table.renderRows()
  }

  clearCart(): void {
    this.cartService.clearCart()
    this.transactions = this.cartService.getCartItems()
    this.table.renderRows()
  }

  async onBackNav(): Promise<void> {
    await this.router.navigate(['/catalogue'])
  }

  checkout(): void {
    if (this.getTotal() > 0) {
      this.dialogue.open(CheckoutFormComponent, {
        data: {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          address1: '',
          address2: '',
          city: '',
          county: '',
          postcode: '',
          country: '',
          cardNumber: '',
          expiry: '',
          cvc: ''
        }
      })
      return
    }
    this.snackBar.open('Add items to cart first!', 'Close')
  }
}
