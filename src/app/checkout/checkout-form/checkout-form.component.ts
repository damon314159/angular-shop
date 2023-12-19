import { type FirebaseApp, initializeApp } from 'firebase/app'
import { getDatabase, ref, push } from 'firebase/database'
import { Component, Inject, ViewChild } from '@angular/core'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog'
import { FormsModule, NgForm } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { type DialogueData } from '../../interfaces/dialogue-data'
import { CommonModule } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
  EmailValidatorDirective,
  ExpiryValidatorDirective,
  PhoneValidatorDirective,
  PostcodeValidatorDirective
} from './form-validators.directive'
import { CartService } from '../../services/cart.service'
import { Transaction } from '../../interfaces/transaction'

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
    PhoneValidatorDirective,
    EmailValidatorDirective,
    PostcodeValidatorDirective,
    ExpiryValidatorDirective
  ],
  templateUrl: './checkout-form.component.html',
  styleUrl: './checkout-form.component.scss'
})
export class CheckoutFormComponent {
  constructor(
    public dialogueRef: MatDialogRef<CheckoutFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogueData,
    private readonly snackBar: MatSnackBar,
    private readonly cartService: CartService
  ) {}

  @ViewChild('checkoutForm', { static: true })
  checkoutForm!: NgForm

  onCancelClick(): void {
    this.dialogueRef.close()
  }

  async submitData(data: DialogueData, items: Transaction[], costs: Record<string, number>): Promise<void> {
    const firebaseConfig = {
      apiKey: 'AIzaSyDHG2yKPwXc9q7DKGPOBsisSQ5N0GKDrU4',
      authDomain: 'wywm-shop.firebaseapp.com',
      projectId: 'wywm-shop',
      databaseURL: 'https://wywm-shop-default-rtdb.firebaseio.com/',
      storageBucket: 'wywm-shop.appspot.com',
      messagingSenderId: '1042038869660',
      appId: '1:1042038869660:web:827615f46033e5459c6759'
    }
    const app: FirebaseApp = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dataRef = ref(db, 'orders')

    await push(dataRef, Object.assign({ userData: data }, { items }, { costs }))
  }

  submitForm(): void {
    if (this.checkoutForm.valid ?? false) {
      this.dialogueRef.close(this.data)
      this.snackBar.open('Checkout success', 'Close')

      const items = this.cartService.getCartItems().slice(0)
      const costs = this.cartService.getCosts()
      void this.submitData(this.data, items, costs)

      this.cartService.clearCart()
      this.cartService.triggerTableRefresh()
      return
    }
    for (const control of Object.keys(this.checkoutForm.controls)) {
      this.checkoutForm.controls[control].markAsTouched()
    }
  }
}
