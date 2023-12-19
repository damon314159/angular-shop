import { Injectable } from '@angular/core'
import { type Transaction } from '../interfaces/transaction'
import { type CategorisedItem } from '../interfaces/categorised-item'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private readonly snackBar: MatSnackBar) {}

  cartItems: Transaction[] = []

  private readonly tableRefreshSubject = new Subject<void>()
  tableRefresh = this.tableRefreshSubject.asObservable()
  triggerTableRefresh(): void {
    this.tableRefreshSubject.next()
  }

  findByCategoryId(category: string, id: number): Transaction | undefined {
    return this.cartItems.find((t) => t.category === category && t.id === id)
  }

  getCartItems(): Transaction[] {
    return this.cartItems
  }

  addToCart(item: CategorisedItem): void {
    this.snackBar.open('Added to cart!', 'Close')
    if (this.findByCategoryId(item.category, item.id) !== undefined) {
      this.findByCategoryId(item.category, item.id)!.quantity += 1
      return
    }
    const transaction = Object.assign(item, { quantity: 1 })
    this.cartItems.push(transaction)
  }

  removeFromCart(item: CategorisedItem): void {
    this.snackBar.open('Removed from cart', 'Close')
    const transaction = this.findByCategoryId(item.category, item.id)
    if (transaction !== undefined) {
      transaction.quantity -= 1
      if (transaction.quantity === 0) {
        const index = this.cartItems.findIndex((el) => el === transaction)
        this.cartItems.splice(index, 1)
      }
    }
  }

  clearCart(): void {
    this.snackBar.open('Cart cleared', 'Close')
    while (this.cartItems.length > 0) {
      this.cartItems.pop()
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
  }

  getTotalQuantity(): number {
    return this.cartItems.map((item) => item.quantity).reduce((acc, value) => acc + value, 0)
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
