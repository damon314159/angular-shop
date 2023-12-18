import { Injectable } from '@angular/core'
import { type Transaction } from '../interfaces/transaction'
import { type CategorisedItem } from '../interfaces/categorised-item'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private readonly snackBar: MatSnackBar) {}

  cartItems: Transaction[] = []

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
}
