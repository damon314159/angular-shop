import { Injectable } from '@angular/core'
import { type Transaction } from '../interfaces/transaction'
import { type CategorisedItem } from '../interfaces/categorised-item'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Dependency injection in constructor
  constructor(private readonly snackBar: MatSnackBar) {}

  // Cart items will be an array of Transaction typed objects
  cartItems: Transaction[] = []

  // Set up an event emitter that will trigger change detection in the checkout
  private readonly tableRefreshSubject = new Subject<void>()
  tableRefresh = this.tableRefreshSubject.asObservable()
  // When the method is called anywhere, the cart service will emit the event...
  // That the checkout component listens for in order to trigger a refresh
  triggerTableRefresh(): void {
    this.tableRefreshSubject.next()
  }

  // Return the transaction in the cart matching the category and ID, if any
  findByCategoryId(category: string, id: number): Transaction | undefined {
    return this.cartItems.find((t) => t.category === category && t.id === id)
  }

  // To return the current state of the cart to anywhere the service is injected
  getCartItems(): Transaction[] {
    return this.cartItems
  }

  // Add an item to the cart, or increase its quantity in the cart if it exists already
  // Take an input of CategorisedItem typing from the service recipient
  addToCart(item: CategorisedItem): void {
    // Display a brief success message
    this.snackBar.open('Added to cart!', 'Close')
    // Attempt to find the item by its category and ID
    if (this.findByCategoryId(item.category, item.id) !== undefined) {
      // Increase the transaction's quantity by 1 if it was found
      this.findByCategoryId(item.category, item.id)!.quantity += 1
      return
    }
    // If it was not found, assign a quantity of 1 to the Item to form a transaction
    const transaction = Object.assign(item, { quantity: 1 })
    // And add it to the cart
    this.cartItems.push(transaction)
  }

  // Reduce the quantity of an item in the cart, or if that quantity is 1, remove it
  // Take an input of CategorisedItem typing from the service recipient
  removeFromCart(item: CategorisedItem): void {
    // Display a brief success message
    this.snackBar.open('Removed from cart', 'Close')
    // Attempt to find the item by its category and ID
    const transaction = this.findByCategoryId(item.category, item.id)
    if (transaction !== undefined) {
      // Decrease the transaction's quantity by 1 if it was found
      transaction.quantity -= 1
      if (transaction.quantity === 0) {
        const index = this.cartItems.findIndex((el) => el === transaction)
        // If the quantity is reduced to 0 by this operation, remove the transaction
        this.cartItems.splice(index, 1)
      }
    }
    // If it was not found, there is nothing to be removed, so do nothing
  }

  // Remove all transactions from the cart
  clearCart(): void {
    this.snackBar.open('Cart cleared', 'Close')
    while (this.cartItems.length > 0) {
      this.cartItems.pop()
    }
  }

  // Return the sum of all quantities in the cart
  getTotalQuantity(): number {
    return this.cartItems.map((item) => item.quantity).reduce((acc, value) => acc + value, 0)
  }

  // A series of methods to calculate values according to the project spec.
  getTotalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
  }

  getTax(): number {
    return this.getTotalPrice() * 0.1
  }

  getShipping(): number {
    return this.getTotalQuantity() > 0 ? 20 : 0
  }

  getTotal(): number {
    return this.getTotalPrice() + this.getTax() + this.getShipping()
  }

  // Return an object containing all the associated costs for storage in the DB
  getCosts(): Record<string, number> {
    return {
      totalPrice: this.getTotalPrice(),
      totalQuantity: this.getTotalQuantity(),
      tax: this.getTax(),
      shipping: this.getShipping(),
      total: this.getTotal()
    }
  }
}
