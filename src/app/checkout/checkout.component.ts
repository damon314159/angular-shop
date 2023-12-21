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
import { type DialogueData } from '../interfaces/dialogue-data'

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
  // Dependency injection in constructor
  constructor(
    private readonly cartService: CartService,
    private readonly router: Router,
    public dialogue: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  // Initialise the table columns
  displayedColumns: string[] = ['item', 'quantity', 'price']
  // Allow access to the table child element
  @ViewChild(MatTable) table!: MatTable<any>

  // Initialise a local copy of the transactions...
  transactions: Transaction[] = []

  // Which are then retrieved on initialisation of the component from cart service
  ngOnInit(): void {
    this.transactions = this.cartService.getCartItems()
    this.cartService.tableRefresh.subscribe(() => {
      // Each time a table refresh update is emitted, rerender the table contents
      this.table.renderRows()
    })
  }

  // A series of methods that call the corresponding cart service methods
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

  // Add quantity and then rerender the table in case a row needs adding
  plusQuantity(transaction: Transaction): void {
    const item = this.transactions.find((t) => t === transaction)!
    this.cartService.addToCart(item)
    this.transactions = this.cartService.getCartItems()
    this.table.renderRows()
  }

  // Remove quantity and then rerender the table in case a row needs removing
  minusQuantity(transaction: Transaction): void {
    const item = this.transactions.find((t) => t === transaction)!
    this.cartService.removeFromCart(item)
    this.transactions = this.cartService.getCartItems()
    this.table.renderRows()
  }

  // Clear cart and rerender to remove all product rows
  clearCart(): void {
    this.cartService.clearCart()
    this.transactions = this.cartService.getCartItems()
    this.table.renderRows()
  }

  // Router command for the back to shop button
  async onBackNav(): Promise<void> {
    await this.router.navigate(['/catalogue'])
  }

  // When the checkout button is pressed
  checkout(): void {
    // If the cart is non empty
    if (this.getTotal() > 0) {
      // Initialise a data object
      const data: DialogueData = {
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
      // Open the form dialogue box with that object to be populated
      this.dialogue.open(CheckoutFormComponent, { data })
      return
    }
    // If the cart was empty, show a message instead
    this.snackBar.open('Add items to cart first!', 'Close')
  }
}
