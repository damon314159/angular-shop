import { Injectable } from '@angular/core'

export interface Item {
  id: number
  name: string
  image: string
  price: number
}

export interface Transaction extends Item {
  quantity: number
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: Transaction[] = []

  findById(id: number): Transaction | undefined {
    return this.cartItems.find((t) => t.id === id)
  }

  getCartItems(): Transaction[] {
    return this.cartItems
  }

  addToCart(item: Item): void {
    if (this.findById(item.id) !== undefined) {
      this.findById(item.id)!.quantity += 1
      return
    }
    const transaction = Object.assign(item, { quantity: 1 })
    this.cartItems.push(transaction)
  }

  removeFromCart(item: Item): void {
    const transaction = this.findById(item.id)
    if (transaction !== undefined) {
      transaction.quantity -= 1
      if (transaction.quantity === 0) {
        const index = this.cartItems.findIndex((el) => el === transaction)
        this.cartItems.splice(index, 1)
      }
    }
  }

  clearCart(): void {
    while (this.cartItems.length > 0) {
      this.cartItems.pop()
    }
  }
}
